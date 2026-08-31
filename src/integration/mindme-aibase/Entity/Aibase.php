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

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'mindme_aibase_lesson')]
class Aibase extends AbstractResource
{
    /** AI 模型名（如 gpt-4o / qwen-max） */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $modelName = null;

    /** API key（AES-256-GCM 密文：base64(iv):base64(tag):base64(cipher)，明文绝不落库） */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $apiKey = null;

    /** 有效期（到期后 AI 调用被拒绝） */
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTime $expiresAt = null;

    /** 平台默认资源（全库唯一，Serializer 保证） */
    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $isDefault = false;

    /** 试用配额（count 模式下每个登录用户对该资源的累计调用上限；null = 走平台兜底） */
    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $usageLimit = null;

    /** 限制类型：none 无限制 | time 时间范围 | count 限制次数（三选一互斥） */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $restrictionType = null;

    /** 时间范围起点（time 模式生效窗口为 [startAt, expiresAt]） */
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTime $startAt = null;

    public function getModelName(): ?string
    {
        return $this->modelName;
    }

    public function setModelName(?string $modelName): void
    {
        $this->modelName = $modelName;
    }

    public function getApiKey(): ?string
    {
        return $this->apiKey;
    }

    public function setApiKey(?string $apiKey): void
    {
        $this->apiKey = $apiKey;
    }

    public function getExpiresAt(): ?\DateTime
    {
        return $this->expiresAt;
    }

    public function setExpiresAt(?\DateTime $expiresAt): void
    {
        $this->expiresAt = $expiresAt;
    }

    public function isDefault(): bool
    {
        return $this->isDefault;
    }

    public function setIsDefault(bool $isDefault): void
    {
        $this->isDefault = $isDefault;
    }

    public function getUsageLimit(): ?int
    {
        return $this->usageLimit;
    }

    public function setUsageLimit(?int $usageLimit): void
    {
        $this->usageLimit = $usageLimit;
    }

    public function getRestrictionType(): ?string
    {
        return $this->restrictionType ?: 'none';
    }

    public function setRestrictionType(?string $restrictionType): void
    {
        $this->restrictionType = $restrictionType;
    }

    public function getStartAt(): ?\DateTime
    {
        return $this->startAt;
    }

    public function setStartAt(?\DateTime $startAt): void
    {
        $this->startAt = $startAt;
    }

    /**
     * Whether the resource is past its validity window (legacy single-point check).
     */
    public function isExpired(): bool
    {
        return null !== $this->expiresAt && $this->expiresAt < new \DateTime();
    }

    /**
     * Whether `$now` falls outside the time-range window [startAt, expiresAt].
     * Only meaningful when restrictionType === 'time'.
     */
    public function isRestrictedByTime(?\DateTime $now = null): bool
    {
        $now = $now ?? new \DateTime();

        if (null !== $this->startAt && $now < $this->startAt) {
            return true;
        }

        return null !== $this->expiresAt && $this->expiresAt < $now;
    }
}