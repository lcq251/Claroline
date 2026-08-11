<?php

namespace Claroline\MindMeAiBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Legacy AI course-generation endpoint (C-24: the course-generation feature is
 * deprecated — the frontend no longer calls this route). Kept alive as the AI
 * call entry point, guarded by the model resource validity window (T6): once
 * the platform default AiLesson has expired, the call is refused with a 403
 * and a translated message. No restriction (no default resource, or no
 * expiry set) → the call passes through.
 */
class AiGeneratorController
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly TranslatorInterface $translator
    ) {
    }

    #[Route('/apiv2/mindme_ai/generate', name: 'apiv2_mindme_ai_generate', methods: ['POST'])]
    public function generate(Request $request): JsonResponse
    {
        // T6: the AI call is refused once the platform default model resource expired.
        $default = $this->om->getRepository(AiLesson::class)->findOneBy(['isDefault' => true]);

        if ($default && $default->isExpired()) {
            return new JsonResponse(
                ['message' => $this->translator->trans('ai_lesson_expired', [], 'resource')],
                403
            );
        }

        $data = json_decode($request->getContent(), true);
        $topic      = $data['topic'] ?? '';
        $subject    = $data['subject'] ?? 'math';
        $grade      = $data['grade'] ?? 'middle';
        $difficulty = $data['difficulty'] ?? 'standard';
        $module     = $data['module'] ?? 'lesson_plan';

        $prompt = $this->buildPrompt($topic, $subject, $grade, $difficulty, $module);
        $rawContent = $this->callDeepSeek($prompt);
        $structured = $this->parseContent($rawContent, $topic, $subject, $grade, $difficulty, $module);

        return new JsonResponse($structured);
    }

    private function buildPrompt(string $topic, string $subject, string $grade, string $difficulty, string $module): string
    {
        $names = ['english'=>'英语','math'=>'数学','chinese'=>'语文','physics'=>'物理','chemistry'=>'化学','biology'=>'生物','history'=>'历史','geography'=>'地理','politics'=>'政治'];
        $grades = ['elementary'=>'小学','middle'=>'初中','high'=>'高中'];
        $diffs = ['story'=>'基础入门','standard'=>'标准难度','competition'=>'竞赛拔高'];
        $subj = $names[$subject] ?? $subject;
        $grd = $grades[$grade] ?? $grade;
        $diff = $diffs[$difficulty] ?? $difficulty;
        return "你是一位{$subj}教育专家。请为{$grd}{$diff}学生生成关于{$topic}的教学内容。请输出有效JSON。";
    }

    private function callDeepSeek(string $prompt): string
    {
        $keyFile = '/home/lcq25/.hermes/deepseek_key';
        if (!file_exists($keyFile)) { return ''; }
        $apiKey = trim(file_get_contents($keyFile));
        if (empty($apiKey)) { return ''; }

        $payload = json_encode([
            'model' => 'deepseek-chat',
            'messages' => [
                ['role' => 'system', 'content' => '你是教育内容生成AI，始终返回有效JSON。'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.7,
            'max_tokens' => 4096,
        ]);

        $ch = curl_init('https://api.deepseek.com/chat/completions');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: *** ' . $apiKey,
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);

        $response = curl_exec($ch);
        curl_close($ch);
        if (!$response) { return ''; }

        $data = json_decode($response, true);
        return $data['choices'][0]['message']['content'] ?? '';
    }

    private function parseContent(string $raw, string $topic, string $subject, string $grade, string $difficulty, string $module): array
    {
        $jsonStart = strpos($raw, '{');
        $jsonEnd = strrpos($raw, '}');
        if ($jsonStart !== false && $jsonEnd !== false) {
            $jsonStr = substr($raw, $jsonStart, $jsonEnd - $jsonStart + 1);
            $parsed = json_decode($jsonStr, true);
            if ($parsed) {
                $parsed['subject'] = $subject;
                $parsed['grade'] = $grade;
                $parsed['difficulty'] = $difficulty;
                $parsed['module'] = $module;
                return $parsed;
            }
        }
        return [
            'title' => $topic, 'subject' => $subject, 'grade' => $grade,
            'difficulty' => $difficulty, 'module' => $module,
            'sections' => [['emoji' => '📖', 'title' => 'AI 生成', 'body' => nl2br($raw)]],
        ];
    }
}
