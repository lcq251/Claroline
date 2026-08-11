<?php

namespace Claroline\MindMeAiBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_mindme_ai_lesson')]
class AiLesson extends AbstractResource
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

    /** 平台默认资源（全库唯一，Serializer/Manager 保证） */
    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $isDefault = false;

    /** 试用限额（每次登录用户对该资源的每日调用上限；null = 走平台兜底 mindme_ai.daily_limit） */
    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $usageLimit = null;

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

    /**
     * Whether the resource is past its validity window.
     */
    public function isExpired(): bool
    {
        return null !== $this->expiresAt && $this->expiresAt < new \DateTime();
    }
}
