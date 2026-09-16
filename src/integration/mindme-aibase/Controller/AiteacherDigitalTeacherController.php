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
use Mindme\AibaseBundle\Entity\UserAvatar;
use Mindme\AibaseBundle\Entity\UserKnowledge;
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

        // Inject the signed-in user's personal knowledge base as retrieval context.
        $user = $this->getAuthenticatedUser();
        if ($user) {
            $knowledge = $this->om->getRepository(UserKnowledge::class)->findOneBy(['user' => $user]);
            if ($knowledge && $knowledge->getEntries()) {
                $kb = json_encode($knowledge->getEntries(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                array_unshift($messages, [
                    'role' => 'system',
                    'content' => "以下是用户的个人知识库（JSON 格式），回答时优先参考其中内容：\n{$kb}",
                ]);
            }
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

    #[Route('/apiv2/mindme_aibase/me', name: 'apiv2_mindme_aibase_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (!is_object($user) || !method_exists($user, 'getId')) {
            return new JsonResponse(['authenticated' => false, 'id' => null, 'username' => null]);
        }

        return new JsonResponse([
            'authenticated' => true,
            'id' => $user->getId(),
            'username' => method_exists($user, 'getUsername') ? $user->getUsername() : null,
        ]);
    }

    #[Route('/apiv2/mindme_aibase/aiteacher/{uuid}/config', name: 'apiv2_mindme_aibase_aiteacher_config', methods: ['GET'])]
    public function config(string $uuid): JsonResponse
    {
        $aiteacher = $this->findAiteacher($uuid);
        if (!$aiteacher) {
            return new JsonResponse(['error' => 'aiteacher_not_found'], Response::HTTP_NOT_FOUND);
        }

        // Personal avatar config (if any) overrides the resource defaults.
        $avatar = $this->findUserAvatar();

        return new JsonResponse([
            'widgetBaseUrl' => '/avatar',
            'modelUrl' => ($avatar?->getModelUrl() ?: $aiteacher->getModelUrl()),
            'voice' => ($avatar?->getVoice() ?: $aiteacher->getVoice()),
            'mode' => ($avatar?->getMode() ?: $aiteacher->getMode()),
            'fit' => ($avatar?->getFit() ?: $aiteacher->getFit()),
            'zoom' => ($avatar?->getZoom() ?? $aiteacher->getZoom()),
            'name' => ($avatar?->getAvatarName() ?: $aiteacher->getAvatarName()),
            'welcome' => ($avatar?->getWelcome() ?: $aiteacher->getWelcome()),
            'greeting' => ($avatar?->getGreeting() ?: $aiteacher->getGreeting()),
            'fallback' => ($avatar?->getFallback() ?: $aiteacher->getFallback()),
            'suggestions' => ($avatar?->getSuggestions() ?? $aiteacher->getSuggestions()),
        ]);
    }

    #[Route('/apiv2/mindme_aibase/me/avatar', name: 'apiv2_mindme_aibase_me_avatar_get', methods: ['GET'])]
    public function getAvatar(): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return new JsonResponse(['error' => 'not_authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $avatar = $this->findUserAvatar();

        return new JsonResponse([
            'modelUrl' => $avatar?->getModelUrl(),
            'voice' => $avatar?->getVoice(),
            'mode' => $avatar?->getMode(),
            'fit' => $avatar?->getFit(),
            'zoom' => $avatar?->getZoom(),
            'name' => $avatar?->getAvatarName(),
            'welcome' => $avatar?->getWelcome(),
            'greeting' => $avatar?->getGreeting(),
            'fallback' => $avatar?->getFallback(),
            'suggestions' => $avatar?->getSuggestions(),
        ]);
    }

    #[Route('/apiv2/mindme_aibase/me/avatar', name: 'apiv2_mindme_aibase_me_avatar_put', methods: ['PUT'])]
    public function putAvatar(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return new JsonResponse(['error' => 'not_authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        $avatar = $this->findUserAvatar();
        if (!$avatar) {
            $avatar = new UserAvatar();
            $avatar->setUser($user);
        }

        if (array_key_exists('modelUrl', $data)) {
            $avatar->setModelUrl($data['modelUrl'] ?: null);
        }
        if (array_key_exists('voice', $data)) {
            $avatar->setVoice($data['voice'] ?: null);
        }
        if (array_key_exists('mode', $data)) {
            $avatar->setMode($data['mode'] ?: null);
        }
        if (array_key_exists('fit', $data)) {
            $avatar->setFit($data['fit'] ?: null);
        }
        if (array_key_exists('zoom', $data)) {
            $avatar->setZoom(null !== $data['zoom'] && '' !== $data['zoom'] ? (int) $data['zoom'] : null);
        }
        if (array_key_exists('name', $data)) {
            $avatar->setAvatarName($data['name'] ?: null);
        }
        if (array_key_exists('welcome', $data)) {
            $avatar->setWelcome($data['welcome'] ?: null);
        }
        if (array_key_exists('greeting', $data)) {
            $avatar->setGreeting($data['greeting'] ?: null);
        }
        if (array_key_exists('fallback', $data)) {
            $avatar->setFallback($data['fallback'] ?: null);
        }
        if (array_key_exists('suggestions', $data)) {
            $avatar->setSuggestions(is_array($data['suggestions']) ? $data['suggestions'] : null);
        }

        $this->om->persist($avatar);
        $this->om->flush();

        return new JsonResponse([
            'modelUrl' => $avatar->getModelUrl(),
            'voice' => $avatar->getVoice(),
            'mode' => $avatar->getMode(),
            'fit' => $avatar->getFit(),
            'zoom' => $avatar->getZoom(),
            'name' => $avatar->getAvatarName(),
            'welcome' => $avatar->getWelcome(),
            'greeting' => $avatar->getGreeting(),
            'fallback' => $avatar->getFallback(),
            'suggestions' => $avatar->getSuggestions(),
        ]);
    }

    private function getAuthenticatedUser(): ?object
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (is_object($user) && method_exists($user, 'getId')) {
            return $user;
        }

        return null;
    }

    private function findUserAvatar(): ?UserAvatar
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return null;
        }

        return $this->om->getRepository(UserAvatar::class)->findOneBy(['user' => $user]);
    }

    #[Route('/apiv2/mindme_aibase/me/knowledge', name: 'apiv2_mindme_aibase_me_knowledge_get', methods: ['GET'])]
    public function getKnowledge(): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return new JsonResponse(['error' => 'not_authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $knowledge = $this->om->getRepository(UserKnowledge::class)->findOneBy(['user' => $user]);

        return new JsonResponse([
            'entries' => $knowledge?->getEntries() ?? [],
            'updatedAt' => $knowledge?->getUpdatedAt()?->format('c'),
        ]);
    }

    #[Route('/apiv2/mindme_aibase/me/knowledge', name: 'apiv2_mindme_aibase_me_knowledge_put', methods: ['PUT'])]
    public function putKnowledge(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return new JsonResponse(['error' => 'not_authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $entries = $data['entries'] ?? null;
        if (!is_array($entries)) {
            return new JsonResponse(['error' => 'entries_must_be_array'], Response::HTTP_BAD_REQUEST);
        }

        // Validate + normalise entries to {q, a, kw, source?}.
        $clean = [];
        foreach ($entries as $index => $item) {
            if (!is_array($item)) {
                return new JsonResponse(['error' => 'invalid_entry', 'index' => $index], Response::HTTP_BAD_REQUEST);
            }
            $q = trim((string) ($item['q'] ?? ''));
            $a = trim((string) ($item['a'] ?? ''));
            if ('' === $q || '' === $a) {
                return new JsonResponse(['error' => 'entry_requires_q_and_a', 'index' => $index], Response::HTTP_BAD_REQUEST);
            }
            $entry = ['q' => $q, 'a' => $a, 'kw' => trim((string) ($item['kw'] ?? ''))];
            if (isset($item['source']) && is_array($item['source'])) {
                $entry['source'] = $item['source'];
            }
            $clean[] = $entry;
        }

        $knowledge = $this->om->getRepository(UserKnowledge::class)->findOneBy(['user' => $user]);
        if (!$knowledge) {
            $knowledge = new UserKnowledge();
            $knowledge->setUser($user);
        }

        $knowledge->setEntries($clean);
        $knowledge->setUpdatedAt(new \DateTime());
        $this->om->persist($knowledge);
        $this->om->flush();

        return new JsonResponse([
            'entries' => $knowledge->getEntries(),
            'updatedAt' => $knowledge->getUpdatedAt()?->format('c'),
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
