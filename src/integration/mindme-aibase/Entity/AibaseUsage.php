<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * 试用次数计数——「登录用户 × Aibase 资源」累计计数（终身不重置）。
 *
 * Pure counter row (no ORM relation, aibaseId is a plain scalar): the quota
 * targets the model configured on the Aibase resource, so each resource is
 * counted independently. usageLimit is a snapshot of the resource's usageLimit
 * at row creation; when the resource has no usageLimit, the row is created
 * with the platform fallback (default 20).
 *
 * Lifetime cumulative: UNIQUE(userId, aibaseId).
 */
#[ORM\Entity]
#[ORM\Table(name: 'mindme_aibase_usage')]
#[ORM\UniqueConstraint(name: 'uniq_user_lesson', columns: ['userId', 'aibaseId'])]
class AibaseUsage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    /** 登录用户 id（标量） */
    #[ORM\Column(type: Types::INTEGER)]
    private int $userId = 0;

    /** 该 Aibase 资源 id（标量） */
    #[ORM\Column(type: Types::INTEGER)]
    private int $aibaseId = 0;

    /** 累计已用次数（终身不重置） */
    #[ORM\Column(type: Types::INTEGER)]
    private int $usageCount = 0;

    /** 累计限额（资源 usageLimit 快照） */
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

    public function getAibaseId(): int
    {
        return $this->aibaseId;
    }

    public function setAibaseId(int $aibaseId): void
    {
        $this->aibaseId = $aibaseId;
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