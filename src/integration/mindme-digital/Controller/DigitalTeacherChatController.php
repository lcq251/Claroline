<?php

namespace Mindme\DigitalBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Mindme\DigitalBundle\Entity\DigitalTeacher;
use Mindme\DigitalBundle\Security\SecretCipher;
use Mindme\DigitalBundle\TTS\EdgeTTSProvider;
use Mindme\DigitalBundle\TTS\TTSProviderInterface;
use Mindme\DigitalBundle\TTS\NullTTSProvider;
use Mindme\DigitalBundle\TTS\VolcTTSProvider;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Digital Teacher endpoints.
 *
 * Session model: EPHEMERAL. No conversation is persisted — the frontend sends
 * the full transcript (messages) with every turn and this controller only acts
 * as a stats-less, streaming AI proxy for the current request.
 */
class DigitalTeacherChatController
{
    private const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';

    public function __construct(
        private readonly ObjectManager $om,
        private readonly AuthorizationCheckerInterface $authChecker,
        private readonly SecretCipher $cipher,
        private readonly PlatformConfigurationHandler $config,
        private readonly TTSProviderInterface $ttsProvider = new NullTTSProvider(),
        private readonly ?EdgeTTSProvider $edgeTts = null
    ) {
    }

    #[Route('/apiv2/mindme_digital/digital_teacher/chat_stream', name: 'apiv2_mindme_digital_digital_teacher_chat_stream', methods: ['POST'])]
    public function chatStream(Request $request): Response
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $resourceUuid = $data['resourceUuid'] ?? null;
        $messages = $data['messages'] ?? [];
        $temperature = (float) ($data['temperature'] ?? 0.8);
        $maxTokens = (int) ($data['maxTokens'] ?? 16384);

        if (!$resourceUuid || empty($messages)) {
            return new JsonResponse(['error' => 'missing resourceUuid or messages'], Response::HTTP_BAD_REQUEST);
        }

        $teacher = $this->teacherFromResourceUuid((string) $resourceUuid);
        if (!$teacher) {
            return new JsonResponse(['error' => 'digital_teacher_not_found'], Response::HTTP_NOT_FOUND);
        }

        $node = $teacher->getResourceNode();
        if ($node && !$this->authChecker->isGranted('OPEN', $node)) {
            return new JsonResponse(['error' => 'no_permission'], Response::HTTP_FORBIDDEN);
        }

        if ($teacher->isExpired()) {
            return new JsonResponse(['error' => 'expired'], Response::HTTP_FORBIDDEN);
        }

        if (!$teacher->getApiKey()) {
            return new JsonResponse(['error' => 'no_api_key'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $apiKey = $this->cipher->decrypt($teacher->getApiKey());
        } catch (\RuntimeException) {
            return new JsonResponse(['error' => 'api_key_decrypt_failed'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $model = $teacher->getModelName() ?: 'deepseek-chat';
        $baseUrl = (string) ($teacher->getApiBaseUrl() ?: self::DEFAULT_BASE_URL);

        $response = new StreamedResponse(function () use ($apiKey, $model, $baseUrl, $messages, $temperature, $maxTokens) {
            while (ob_get_level() > 0) {
                ob_end_flush();
            }

            $this->stream([$baseUrl, $apiKey, $model, $messages, $temperature, $maxTokens]);
        });

        $response->headers->set('Content-Type', 'text/event-stream; charset=utf-8');
        $response->headers->set('Cache-Control', 'no-cache, no-transform');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Connection', 'keep-alive');

        return $response;
    }

    /**
     * Ephemeral TTS endpoint. Returns raw audio bytes (or a JSON error) for the
     * configured engine. With no real engine configured (NullTTSProvider) the
     * player degrades to silent text-only chat.
     */
    #[Route('/apiv2/mindme_digital/digital_teacher/tts', name: 'apiv2_mindme_digital_digital_teacher_tts', methods: ['POST'])]
    public function tts(Request $request): Response
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $resourceUuid = $data['resourceUuid'] ?? null;
        $text = trim((string) ($data['text'] ?? ''));

        if (!$resourceUuid || '' === $text) {
            return new JsonResponse(['error' => 'missing resourceUuid or text'], Response::HTTP_BAD_REQUEST);
        }

        $teacher = $this->teacherFromResourceUuid((string) $resourceUuid);
        if (!$teacher) {
            return new JsonResponse(['error' => 'digital_teacher_not_found'], Response::HTTP_NOT_FOUND);
        }

        $options = [
            'voice' => $teacher->getVoiceId(),
            'rate' => $teacher->getRate() ?? 1.0,
            'pitch' => $teacher->getPitch() ?? 0.0,
        ];

        $provider = match ($teacher->getTtsEngine()) {
            'volc' => new VolcTTSProvider(
                (string) ($teacher->getTtsAppId() ?? ''),
                (string) ($teacher->getTtsToken() ?? '')
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

    private function teacherFromResourceUuid(string $uuid): ?DigitalTeacher
    {
        $node = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $uuid]);
        if (!$node) {
            return null;
        }

        return $this->om->getRepository(DigitalTeacher::class)->findOneBy(['resourceNode' => $node]);
    }

    private function stream(array $args): void
    {
        [$baseUrl, $apiKey, $model, $messages, $temperature, $maxTokens] = $args;

        $payload = json_encode([
            'model' => $model,
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
            'stream' => true,
        ]);

        $ch = curl_init(rtrim($baseUrl, '/').'/chat/completions');
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
}
