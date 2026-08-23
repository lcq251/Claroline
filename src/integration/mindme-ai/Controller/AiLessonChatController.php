<?php

namespace Claroline\MindMeAiBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Entity\AiLessonUsage;
use Claroline\MindMeAiBundle\Security\SecretCipher;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Streaming AI proxy endpoint for the ai-genenator H5 (web_resource iframe).
 *
 * The H5 frontend builds the prompt (messages) client-side and POSTs here;
 * Claroline only validates, decrypts the AiLesson API key, streams the
 * DeepSeek response back as SSE, and consumes the daily quota on success.
 *
 * Endpoint:
 *   POST /apiv2/mindme_ai/chat
 *   body: { aiLessonId: int, messages: [{role, content}], temperature?, maxTokens? }
 *   resp: text/event-stream (data: <delta> ... data: [DONE])
 */
class AiLessonChatController
{
    private const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

    public function __construct(
        private readonly ObjectManager $om,
        private readonly AuthorizationCheckerInterface $authChecker,
        private readonly SecretCipher $cipher,
        private readonly TokenStorageInterface $tokenStorage,
    ) {
    }

    #[Route('/apiv2/mindme_ai/chat', name: 'apiv2_mindme_ai_chat', methods: ['POST'])]
    public function chat(Request $request): Response
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $aiLessonId = (int) ($data['aiLessonId'] ?? 0);
        $messages = $data['messages'] ?? [];
        $temperature = (float) ($data['temperature'] ?? 0.8);
        $maxTokens = (int) ($data['maxTokens'] ?? 16384);

        if (!$aiLessonId || empty($messages)) {
            return new JsonResponse(['error' => 'missing aiLessonId or messages'], Response::HTTP_BAD_REQUEST);
        }

        // 1. Locate the AiLesson ------------------------------------------------
        $aiLesson = $this->om->getRepository(AiLesson::class)->find($aiLessonId);
        if (!$aiLesson) {
            return new JsonResponse(['error' => 'ai_lesson_not_found'], Response::HTTP_NOT_FOUND);
        }

        // 2. Three-layer validation (OPEN → expiry → quota) ---------------------
        $node = $aiLesson->getResourceNode();
        if ($node && !$this->authChecker->isGranted('OPEN', $node)) {
            return new JsonResponse(['error' => 'no_permission'], Response::HTTP_FORBIDDEN);
        }

        if ($aiLesson->isExpired()) {
            return new JsonResponse(['error' => 'expired'], Response::HTTP_FORBIDDEN);
        }

        $userId = $this->getUserId();
        $usage = null;
        if ($aiLesson->getUsageLimit() !== null) {
            $usage = $this->om->getRepository(AiLessonUsage::class)->findOneBy([
                'userId' => $userId,
                'aiLessonId' => (int) $aiLesson->getId(),
                'periodDate' => new \DateTime('today'),
            ]);

            if ($usage && $usage->getCount() >= $usage->getLimit()) {
                return new JsonResponse(['error' => 'quota_exceeded'], Response::HTTP_TOO_MANY_REQUESTS);
            }
        }

        // 3. Decrypt the API key + resolve model --------------------------------
        if (!$aiLesson->getApiKey()) {
            return new JsonResponse(['error' => 'no_api_key'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $apiKey = $this->cipher->decrypt($aiLesson->getApiKey());
        } catch (\RuntimeException) {
            return new JsonResponse(['error' => 'api_key_decrypt_failed'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $model = $aiLesson->getModelName() ?: 'deepseek-chat';

        // 4. Stream the DeepSeek response as SSE --------------------------------
        $response = new StreamedResponse(function () use ($apiKey, $model, $messages, $temperature, $maxTokens, $aiLesson, $userId, $usage) {
            // Ensure no output buffering interferes with streaming.
            while (ob_get_level() > 0) {
                ob_end_flush();
            }
            $this->streamDeepSeek($apiKey, $model, $messages, $temperature, $maxTokens);
            // Consume quota on successful stream completion.
            $this->consumeUsage($aiLesson, $userId, $usage);
        });

        $response->headers->set('Content-Type', 'text/event-stream; charset=utf-8');
        $response->headers->set('Cache-Control', 'no-cache, no-transform');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Connection', 'keep-alive');

        return $response;
    }

    /**
     * Streams DeepSeek chat completions, forwarding only the text deltas as
     * bare `data: <text>` SSE lines (the H5 frontend accumulates them).
     */
    private function streamDeepSeek(
        string $apiKey,
        string $model,
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

        $ch = curl_init(self::DEEPSEEK_BASE_URL.'/chat/completions');
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

    private function getUserId(): int
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (is_object($user) && method_exists($user, 'getId')) {
            return (int) $user->getId();
        }

        return 0;
    }

    /**
     * Increment (or create) today's usage row after a successful stream.
     */
    private function consumeUsage(AiLesson $aiLesson, int $userId, ?AiLessonUsage $usage): void
    {
        if ($aiLesson->getUsageLimit() === null) {
            return;
        }

        if (!$usage) {
            $usage = new AiLessonUsage();
            $usage->setUserId($userId);
            $usage->setAiLessonId((int) $aiLesson->getId());
            $usage->setPeriodDate(new \DateTime('today'));
            $usage->setLimit((int) $aiLesson->getUsageLimit());
            $usage->setCount(0);
            $this->om->persist($usage);
        }

        $usage->setCount($usage->getCount() + 1);
        $this->om->flush();
    }
}
