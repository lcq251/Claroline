<?php

namespace Claroline\MindMeAiBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Entity\AiLessonUsage;
use Claroline\MindMeAiBundle\Security\SecretCipher;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Legacy AI course-generation endpoint (C-24: the course-generation feature is
 * deprecated — the frontend no longer calls this route). Kept alive as the AI
 * call entry point, guarded by:
 *
 *  - T6: the model resource validity window — once the platform default
 *    AiLesson has expired, the call is refused with a 403 + translated message.
 *  - C-25 (v2): the daily trial quota — logged-in users are counted per
 *    default resource per day (AiLessonUsage), the quota comes from the
 *    resource's usageLimit (platform fallback mindme_ai.daily_limit when the
 *    resource has none). Only successful AI calls consume the quota.
 *
 * Anonymous users (and requests without a default resource) pass through
 * uncounted — device identification is deferred to a later iteration.
 */
class AiGeneratorController
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly TranslatorInterface $translator,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly PlatformConfigurationHandler $config,
        private readonly SecretCipher $cipher
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

        // C-25 (v2): per-user x per-resource daily trial quota (logged-in users only).
        $user = $this->tokenStorage->getToken()?->getUser();

        $usage = null;
        if ($user instanceof User && $default) {
            $usage = $this->getOrCreateUsage($user, $default);

            if ($usage->getCount() >= $usage->getLimit()) {
                return new JsonResponse(
                    ['message' => $this->translator->trans('ai_lesson_quota_exceeded', [], 'resource')],
                    403
                );
            }
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

        // Only successful AI calls consume the quota (raw content non-empty).
        if ($usage && '' !== $rawContent) {
            $usage->incrementCount();
            $this->om->flush();
        }

        return new JsonResponse($structured);
    }

    /**
     * Today's usage row for the given user x default resource, created lazily
     * (new period_date -> new row, count starts at 0; no cron needed).
     *
     * The row's limit is a snapshot of the resource usageLimit at creation —
     * falling back to the platform default (mindme_ai.daily_limit, default 20)
     * when the resource has none. Changing the resource limit later does not
     * affect existing rows.
     */
    private function getOrCreateUsage(User $user, AiLesson $default): AiLessonUsage
    {
        $today = new \DateTime('today');

        $usage = $this->om->getRepository(AiLessonUsage::class)->findOneBy([
            'userId' => $user->getId(),
            'aiLessonId' => $default->getId(),
            'periodDate' => $today,
        ]);

        if (!$usage) {
            $usage = new AiLessonUsage();
            $usage->setUserId($user->getId());
            $usage->setAiLessonId($default->getId());
            $usage->setPeriodDate($today);
            $usage->setCount(0);
            $usage->setLimit((int) ($default->getUsageLimit() ?? $this->config->getParameter('mindme_ai.daily_limit') ?? 20));
            $this->om->persist($usage);
        }

        return $usage;
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

    /**
     * Calls the DeepSeek chat completion API. Returns the raw content, or ''
     * on any failure (missing key file, HTTP error, unparsable response).
     *
     * Protected (not private) so tests can stub it via an anonymous subclass.
     */
    protected function callDeepSeek(string $prompt): string
    {
        $apiKey = $this->resolveApiKey();
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

    private function resolveApiKey(): string
    {
        $default = $this->om->getRepository(AiLesson::class)->findOneBy(['isDefault' => true]);

        if (!$default || !$default->getApiKey()) {
            return '';
        }

        try {
            return $this->cipher->decrypt($default->getApiKey());
        } catch (\RuntimeException) {
            return '';
        }
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
