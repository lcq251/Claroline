<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * C-25 (v2): 试用次数计数——「登录用户 × AiLesson 资源 × 日期」独立计数。
 *
 * Pure counter row (no ORM relation, aiLessonId is a plain scalar): the
 * quota targets the model configured on the AiLesson resource, so each
 * resource is counted independently. usageLimit is a snapshot of the
 * resource's usageLimit at row creation (changing the resource limit does
 * not affect history); when the resource has no usageLimit, the row is
 * created with the platform fallback (mindme_ai.daily_limit, default 20).
 *
 * Lazy reset: a new period_date simply creates a new row (UNIQUE(userId,
 * aiLessonId, periodDate)), no cron needed.
 */
#[ORM\Entity]
#[ORM\Table(name: 'claro_mindme_ai_usage')]
#[ORM\UniqueConstraint(name: 'uniq_user_lesson_date', columns: ['userId', 'aiLessonId', 'periodDate'])]
class AiLessonUsage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    /** 登录用户 id（标量） */
    #[ORM\Column(type: Types::INTEGER)]
    private int $userId = 0;

    /** 被试用的 AiLesson 资源 id（标量，配额针对该资源配置的模型） */
    #[ORM\Column(type: Types::INTEGER)]
    private int $aiLessonId = 0;

    /** 当日（YYYY-MM-DD） */
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $periodDate = null;

    /** 当日已用次数 */
    #[ORM\Column(type: Types::INTEGER)]
    private int $usageCount = 0;

    /** 当日限额（资源 usageLimit 快照；资源限额定下后改资源不影响历史） */
    #[ORM\Column(type: Types::INTEGER)]
    private int $usageLimit = 20;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): void
    {
        $this->userId = $userId;
    }

    public function getAiLessonId(): int
    {
        return $this->aiLessonId;
    }

    public function setAiLessonId(int $aiLessonId): void
    {
        $this->aiLessonId = $aiLessonId;
    }

    public function getPeriodDate(): ?\DateTime
    {
        return $this->periodDate;
    }

    public function setPeriodDate(?\DateTime $periodDate): void
    {
        $this->periodDate = $periodDate;
    }

    public function getCount(): int
    {
        return $this->usageCount;
    }

    public function setCount(int $usageCount): void
    {
        $this->usageCount = $usageCount;
    }

    public function incrementCount(): void
    {
        ++$this->usageCount;
    }

    public function getLimit(): int
    {
        return $this->usageLimit;
    }

    public function setLimit(int $usageLimit): void
    {
        $this->usageLimit = $usageLimit;
    }
}
