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
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Mindme\AibaseBundle\Entity\Aibase;
use Mindme\AibaseBundle\Entity\AibaseUsage;
use Mindme\AibaseBundle\Library\SecretCipher;
use Mindme\AibaseBundle\Library\TTS\EdgeTTSProvider;
use Mindme\AibaseBundle\Library\TTS\TTSProviderInterface;
use Mindme\AibaseBundle\Library\TTS\NullTTSProvider;
use Mindme\AibaseBundle\Library\TTS\VolcTTSProvider;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Streaming AI proxy endpoint for the aibase resource frontend consumer.
 *
 * The frontend builds the prompt (messages) client-side and POSTs here;
 * Claroline only validates, decrypts the Aibase API key, streams the
 * DeepSeek response back as SSE, and enforces the resource restriction type
 * (none | time window | count) — 'count' consumes the per-user cumulative
 * quota on success, 'time' enforces the [startAt, expiresAt] window.
 *
 * Endpoint:
 *   POST /apiv2/mindme_aibase/chat
 *   body: { aiLessonId: int, messages: [{role, content}], temperature?, maxTokens? }
 *   resp: text/event-stream (data: <delta> ... data: [DONE])
 */
class AibaseChatController
{
    // fallback base URL when a resource has no resolvable platform/api url
    private const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';

    public function __construct(
        private readonly ObjectManager $om,
        private readonly AuthorizationCheckerInterface $authChecker,
        private readonly SecretCipher $cipher,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly PlatformConfigurationHandler $config,
        private readonly TTSProviderInterface $ttsProvider = new NullTTSProvider(),
        private readonly ?EdgeTTSProvider $edgeTts = null
    ) {
    }

    #[Route('/apiv2/mindme_aibase/chat', name: 'apiv2_mindme_aibase_chat', methods: ['POST'])]
    public function chat(Request $request): Response
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $aibaseId = (int) ($data['aibaseId'] ?? 0);
        // Locate by ResourceNode uuid when the Aibase int id is not exposed.
        $resourceUuid = $data['resourceUuid'] ?? null;
        $messages = $data['messages'] ?? [];
        $temperature = (float) ($data['temperature'] ?? 0.8);
        $maxTokens = (int) ($data['maxTokens'] ?? 16384);

        if ((!$aibaseId && !$resourceUuid) || empty($messages)) {
            return new JsonResponse(['error' => 'missing aibaseId/resourceUuid or messages'], Response::HTTP_BAD_REQUEST);
        }

        // 1. Locate the Aibase ------------------------------------------------
        $aibase = $aibaseId
            ? $this->om->getRepository(Aibase::class)->find($aibaseId)
            : $this->aibaseFromResourceUuid((string) $resourceUuid);
        if (!$aibase) {
            return new JsonResponse(['error' => 'aibase_not_found'], Response::HTTP_NOT_FOUND);
        }

        // 2. Access validation (OPEN → restriction-type gate) ------------------
        $node = $aibase->getResourceNode();
        if ($node && !$this->authChecker->isGranted('OPEN', $node)) {
            return new JsonResponse(['error' => 'no_permission'], Response::HTTP_FORBIDDEN);
        }

        $userId = $this->getUserId();

        // 'time' → only the [startAt, expiresAt] window is enforced.
        if ('time' === $aibase->getRestrictionType() && $aibase->isRestrictedByTime(new \DateTime())) {
            return new JsonResponse(['error' => 'access_restricted'], Response::HTTP_FORBIDDEN);
        }

        // 'count' → only the per-user lifetime cumulative count is enforced.
        $usage = null;
        if ('count' === $aibase->getRestrictionType()) {
            $usage = $this->om->getRepository(AibaseUsage::class)->findOneBy([
                'userId' => $userId,
                'aibaseId' => (int) $aibase->getId(),
            ]);

            if ($usage && $usage->getCount() >= $this->getCountLimit($aibase)) {
                return new JsonResponse(['error' => 'access_restricted'], Response::HTTP_TOO_MANY_REQUESTS);
            }
        }

        // 3. Decrypt the API key + resolve model --------------------------------
        if (!$aibase->getApiKey()) {
            return new JsonResponse(['error' => 'no_api_key'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $apiKey = $this->cipher->decrypt($aibase->getApiKey());
        } catch (\RuntimeException) {
            return new JsonResponse(['error' => 'api_key_decrypt_failed'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $model = $aibase->getModelName() ?: 'deepseek-chat';
        $baseUrl = rtrim($aibase->resolveBaseUrl() ?: self::DEFAULT_BASE_URL, '/');

        // 4. Stream the platform response as SSE --------------------------------
        $response = new StreamedResponse(function () use ($apiKey, $model, $baseUrl, $messages, $temperature, $maxTokens, $aibase, $userId, $usage) {
            // Ensure no output buffering interferes with streaming.
            while (ob_get_level() > 0) {
                ob_end_flush();
            }
            $this->streamChat($apiKey, $model, $baseUrl, $messages, $temperature, $maxTokens);
            // Consume quota on successful stream completion.
            $this->consumeUsage($aibase, $userId, $usage);
        });

        $response->headers->set('Content-Type', 'text/event-stream; charset=utf-8');
        $response->headers->set('Cache-Control', 'no-cache, no-transform');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Connection', 'keep-alive');

        return $response;
    }

    /**
     * Ephemeral TTS endpoint. Returns raw audio bytes (or a JSON error) for the
     * configured engine. With no real engine configured (default) the player
     * degrades to the browser Web Speech API (no host Python required); the
     * `edge` engine is opt-in and needs `pip install edge-tts` on the host.
     */
    #[Route('/apiv2/mindme_aibase/tts', name: 'apiv2_mindme_aibase_tts', methods: ['POST'])]
    public function tts(Request $request): Response
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $resourceUuid = $data['resourceUuid'] ?? null;
        $text = trim((string) ($data['text'] ?? ''));

        if (!$resourceUuid || '' === $text) {
            return new JsonResponse(['error' => 'missing resourceUuid or text'], Response::HTTP_BAD_REQUEST);
        }

        $aibase = $this->aibaseFromResourceUuid((string) $resourceUuid);
        if (!$aibase) {
            return new JsonResponse(['error' => 'aibase_not_found'], Response::HTTP_NOT_FOUND);
        }

        $node = $aibase->getResourceNode();
        if ($node && !$this->authChecker->isGranted('OPEN', $node)) {
            return new JsonResponse(['error' => 'no_permission'], Response::HTTP_FORBIDDEN);
        }

        $options = [
            'voice' => $aibase->getVoiceId(),
            'rate' => $aibase->getRate() ?? 1.0,
            'pitch' => $aibase->getPitch() ?? 0.0,
        ];

        $provider = match ($aibase->getTtsEngine()) {
            'volc' => new VolcTTSProvider(
                (string) ($aibase->getTtsAppId() ?? ''),
                (string) $this->decryptTtsToken($aibase)
            ),
            'edge' => $this->edgeTts ?? $this->ttsProvider,
            default => $this->ttsProvider,
        };

        $result = $provider->synthesize($text, $options);

        if (!$result['available']) {
            return new JsonResponse(['error' => $result['error'] ?? 'tts_not_configured'], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        $response = new Response($result['data'] ?? '');
        $response->headers->set('Content-Type', $result['content_type'] ?? 'audio/mpeg');

        return $response;
    }

    private function decryptTtsToken(Aibase $aibase): string
    {
        $token = $aibase->getTtsToken();

        return $token ? $this->cipher->decrypt($token) : '';
    }

    /**
     * Streams an OpenAI-compatible chat completion endpoint, forwarding only the
     * text deltas as bare `data: <text>` SSE lines (the frontend accumulates them).
     */
    private function streamChat(
        string $apiKey,
        string $model,
        string $baseUrl,
        array $messages,
        float $temperature,
        int $maxTokens,
    ): void {
        $payload = json_encode([
            'model' => $model,
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
            'stream' => true,
        ]);

        $ch = curl_init($baseUrl.'/chat/completions');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer '.$apiKey,
            ],
            CURLOPT_RETURNTRANSFER => false,
            CURLOPT_TIMEOUT => 120,
        ]);

        // Line buffer + SSE parser: extract choices[].delta.content → bare text.
        $buffer = '';
        curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($ch, string $chunk) use (&$buffer): int {
            $buffer .= $chunk;
            while (false !== ($pos = strpos($buffer, "\n"))) {
                $line = trim(substr($buffer, 0, $pos));
                $buffer = substr($buffer, $pos + 1);

                if (str_starts_with($line, 'data: ')) {
                    $payload = trim(substr($line, 6));
                    if ('' === $payload || '[DONE]' === $payload) {
                        continue;
                    }
                    $decoded = json_decode($payload, true);
                    $delta = $decoded['choices'][0]['delta']['content'] ?? '';
                    if ('' !== $delta) {
                        echo 'data: '.$delta."\n\n";
                        flush();
                    }
                }
            }

            return strlen($chunk);
        });

        curl_exec($ch);
        curl_close($ch);

        echo "data: [DONE]\n\n";
        flush();
    }

    /**
     * Locate an Aibase from a ResourceNode uuid (fallback when the frontend
     * has no Aibase int id — the resource serializer only exposes node fields).
     */
    private function aibaseFromResourceUuid(string $uuid): ?Aibase
    {
        $node = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $uuid]);
        if (!$node) {
            return null;
        }

        return $this->om->getRepository(Aibase::class)->findOneBy(['resourceNode' => $node]);
    }

    private function getUserId(): int
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (is_object($user) && method_exists($user, 'getId')) {
            return (int) $user->getId();
        }

        return 0;
    }

    /**
     * Increment (or create) the per-user cumulative usage row after a successful
     * stream — only when the resource is in 'count' restriction mode.
     */
    private function consumeUsage(Aibase $aibase, int $userId, ?AibaseUsage $usage): void
    {
        if ('count' !== $aibase->getRestrictionType()) {
            return;
        }

        if (!$usage) {
            $usage = new AibaseUsage();
            $usage->setUserId($userId);
            $usage->setAibaseId((int) $aibase->getId());
            $usage->setCount(0);
            $usage->setLimit($this->getCountLimit($aibase));
            $this->om->persist($usage);
        }

        $usage->setCount($usage->getCount() + 1);
        $this->om->flush();
    }

    private function getCountLimit(Aibase $aibase): int
    {
        return (int) ($aibase->getUsageLimit()
            ?? $this->config->getParameter('mindme_aibase.daily_limit')
            ?? 20);
    }
}