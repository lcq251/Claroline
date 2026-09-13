<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Mindme\AibaseBundle\Entity\Aibase;
use Mindme\AibaseBundle\Entity\AibaseUsage;
use Mindme\AibaseBundle\Entity\Aiteacher;
use Mindme\AibaseBundle\Library\DigitalTeacherTicketService;
use Mindme\AibaseBundle\Library\SecretCipher;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Digital-teacher brain + widget auth endpoints.
 *
 * The ai-avatar-bot widget (served from a separate nginx sidecar) is gated by
 * an `auth_request` subrequest against /digital-teacher/validate (ticket), and
 * its LLM brain calls the OpenAI-compatible /{id}/chat/completions here. The
 * brain is the linked Aibase resource (model + API key): Claroline decrypts the
 * key server-side and forwards, so the secret never reaches the browser.
 *
 * Endpoints:
 *   POST /apiv2/mindme_aibase/aiteacher/{id}/ticket             — issue one-time iframe ticket
 *   POST /apiv2/mindme_aibase/aiteacher/{id}/chat/completions   — OpenAI-compatible brain (non-streaming)
 *   GET  /apiv2/mindme_aibase/aiteacher/{id}/api/tags           — fake Ollama ping (widget ready probe)
 *   POST /apiv2/mindme_aibase/digital-teacher/validate          — nginx auth_request ticket check
 */
class AiteacherDigitalTeacherController
{
    private const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';

    public function __construct(
        private readonly ObjectManager $om,
        private readonly AuthorizationCheckerInterface $authChecker,
        private readonly SecretCipher $cipher,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly DigitalTeacherTicketService $tickets,
    ) {
    }

    #[Route('/apiv2/mindme_aibase/aiteacher/{uuid}/ticket', name: 'apiv2_mindme_aibase_aiteacher_ticket', methods: ['POST'])]
    public function issueTicket(string $uuid): JsonResponse
    {
        $aiteacher = $this->findAiteacher($uuid);
        if (!$aiteacher) {
            return new JsonResponse(['error' => 'aiteacher_not_found'], Response::HTTP_NOT_FOUND);
        }

        $node = $aiteacher->getResourceNode();
        if ($node && !$this->authChecker->isGranted('OPEN', $node)) {
            return new JsonResponse(['error' => 'no_permission'], Response::HTTP_FORBIDDEN);
        }

        return new JsonResponse([
            'ticket' => $this->tickets->issue((int) $node->getId(), $this->getUserId()),
            'widgetBaseUrl' => $aiteacher->getWidgetBaseUrl(),
            'modelUrl' => $aiteacher->getModelUrl(),
            'voice' => $aiteacher->getVoice(),
            'mode' => $aiteacher->getMode(),
        ]);
    }

    #[Route('/apiv2/mindme_aibase/aiteacher/{uuid}/chat/completions', name: 'apiv2_mindme_aibase_aiteacher_chat_completions', methods: ['POST'])]
    public function chatCompletions(string $uuid, Request $request): Response
    {
        $aiteacher = $this->findAiteacher($uuid);
        if (!$aiteacher) {
            return new JsonResponse(['error' => 'aiteacher_not_found'], Response::HTTP_NOT_FOUND);
        }

        $node = $aiteacher->getResourceNode();
        if ($node && !$this->authChecker->isGranted('OPEN', $node)) {
            return new JsonResponse(['error' => 'no_permission'], Response::HTTP_FORBIDDEN);
        }

        // Resolve the linked brain (Aibase resource).
        $brain = $this->om->getRepository(Aibase::class)->find($aiteacher->getBrainAibaseId());
        if (!$brain) {
            return new JsonResponse(['error' => 'brain_not_found'], Response::HTTP_NOT_FOUND);
        }

        if (!$brain->getApiKey()) {
            return new JsonResponse(['error' => 'no_api_key'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $apiKey = $this->cipher->decrypt($brain->getApiKey());
        } catch (\RuntimeException) {
            return new JsonResponse(['error' => 'api_key_decrypt_failed'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $messages = $data['messages'] ?? [];
        if (empty($messages)) {
            return new JsonResponse(['error' => 'missing messages'], Response::HTTP_BAD_REQUEST);
        }

        $model = $brain->getModelName() ?: 'deepseek-chat';
        $baseUrl = rtrim($brain->resolveBaseUrl() ?: self::DEFAULT_BASE_URL, '/');
        $temperature = (float) ($data['temperature'] ?? 0.4);
        $maxTokens = (int) ($data['max_tokens'] ?? 220);

        // Forward to the brain's OpenAI-compatible endpoint (non-streaming; the
        // widget expects a full {choices:[{message:{content}}]} JSON body).
        $payload = json_encode([
            'model' => $model,
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
            'stream' => false,
        ]);

        $ch = curl_init($baseUrl.'/chat/completions');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer '.$apiKey,
            ],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 60,
        ]);
        $result = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if (false === $result) {
            return new JsonResponse(['error' => 'brain_request_failed'], Response::HTTP_BAD_GATEWAY);
        }

        // Consume the digital-teacher quota on a successful upstream answer.
        if ($status >= 200 && $status < 300) {
            $this->consumeUsage($aiteacher, $this->getUserId());
        }

        return new Response($result, $status, ['Content-Type' => 'application/json']);
    }

    #[Route('/apiv2/mindme_aibase/aiteacher/{uuid}/api/tags', name: 'apiv2_mindme_aibase_aiteacher_api_tags', methods: ['GET'])]
    public function apiTags(string $uuid): JsonResponse
    {
        // ai-avatar-bot's ping() probes /api/tags (an Ollama-specific route) to
        // decide whether the brain is "ready"; answer it so the widget falls
        // through to the OpenAI-compatible /chat/completions brain.
        return new JsonResponse(['models' => []]);
    }

    #[Route('/apiv2/mindme_aibase/aiteacher/{uuid}/tts', name: 'apiv2_mindme_aibase_aiteacher_tts', methods: ['POST'])]
    public function tts(string $uuid, Request $request): Response
    {
        $aiteacher = $this->findAiteacher($uuid);
        if (!$aiteacher) {
            return new JsonResponse(['error' => 'aiteacher_not_found'], Response::HTTP_NOT_FOUND);
        }

        $node = $aiteacher->getResourceNode();
        if ($node && !$this->authChecker->isGranted('OPEN', $node)) {
            return new JsonResponse(['error' => 'no_permission'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $voice = $data['voice'] ?? 'zh-CN-XiaoxiaoNeural';
        $text = trim((string) ($data['text'] ?? ''));
        if ('' === $text) {
            return new JsonResponse(['error' => 'missing text'], Response::HTTP_BAD_REQUEST);
        }

        // Forward to the edge-tts microservice (internal docker hostname).
        $payload = json_encode(['voice' => $voice, 'text' => $text]);

        $ch = curl_init('http://lamp-edge-tts:8000/tts');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
        ]);
        $audio = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE) ?: 'audio/mpeg';
        curl_close($ch);

        if (false === $audio || $status >= 400) {
            return new JsonResponse(['error' => 'tts_failed'], Response::HTTP_BAD_GATEWAY);
        }

        return new Response($audio, $status, ['Content-Type' => $contentType]);
    }

    #[Route('/apiv2/mindme_aibase/digital-teacher/validate', name: 'apiv2_mindme_aibase_digital_teacher_validate', methods: ['POST', 'GET'])]
    public function validate(Request $request): Response
    {
        $ticket = $request->headers->get('X-DT-Ticket') ?: $request->query->get('tk', '');
        $data = $this->tickets->validate((string) $ticket);

        if (!$data) {
            return new Response('invalid ticket', Response::HTTP_UNAUTHORIZED);
        }

        return new Response('ok', Response::HTTP_OK, [
            'X-User-Id' => (string) ($data['userId'] ?? 0),
        ]);
    }

    private function getUserId(): int
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (is_object($user) && method_exists($user, 'getId')) {
            return (int) $user->getId();
        }

        return 0;
    }

    private function findAiteacher(string $uuid): ?Aiteacher
    {
        $node = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $uuid]);
        if (!$node) {
            return null;
        }

        return $this->om->getRepository(Aiteacher::class)->findOneBy(['resourceNode' => $node]);
    }

    /**
     * Increment (or create) the per-user cumulative usage row for the teacher,
     * reusing AibaseUsage where aibaseId stores the Aiteacher resource id.
     */
    private function consumeUsage(Aiteacher $aiteacher, int $userId): void
    {
        $limit = $aiteacher->getUsageLimit();
        if (!$limit) {
            return;
        }

        $usage = $this->om->getRepository(AibaseUsage::class)->findOneBy([
            'userId' => $userId,
            'aibaseId' => (int) $aiteacher->getId(),
        ]);

        if (!$usage) {
            $usage = new AibaseUsage();
            $usage->setUserId($userId);
            $usage->setAibaseId((int) $aiteacher->getId());
            $usage->setCount(0);
            $usage->setLimit($limit);
            $this->om->persist($usage);
        }

        $usage->setCount($usage->getCount() + 1);
        $this->om->flush();
    }
}
