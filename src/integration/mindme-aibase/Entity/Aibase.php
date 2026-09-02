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

    /**
     * 连接平台类型：deepseek | openai | qwen | kimi | custom（含自定义）。
     * 决定默认 baseUrl；custom 使用 baseUrl 字段。
     */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $platformType = null;

    /** 平台接入 URL（custom 平台必填；预设平台为空时用默认地址） */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $baseUrl = null;

    /** 用户自定义扩展信息（JSON，非敏感连接参数；密钥类禁用明文） */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $extraConfig = null;

    /** 资源形态：model 纯模型（连接测试）| digital_teacher 数字老师（聊天+语音+形象） */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $kind = null;

    /** TTS 引擎：cloud | edge | selfhosted | none */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $ttsEngine = null;

    /** Voice identifier within the chosen TTS engine */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $voiceId = null;

    /** Speech rate, e.g. 1.0 normal */
    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $rate = null;

    /** Speech pitch, e.g. 0.0 normal */
    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $pitch = null;

    /** Avatar type: live2d | vrm | image | none */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $avatarType = null;

    /** Avatar asset reference (uploaded model/image or remote URL) */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $avatarAsset = null;

    /** Volcengine (火山) TTS AppID */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $ttsAppId = null;

    /** Volcengine (火山) TTS Token (Access Token; plaintext never serialized back) */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $ttsToken = null;

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

    public function getPlatformType(): ?string
    {
        return $this->platformType ?: 'custom';
    }

    public function setPlatformType(?string $platformType): void
    {
        $this->platformType = $platformType;
    }

    public function getBaseUrl(): ?string
    {
        return $this->baseUrl;
    }

    public function setBaseUrl(?string $baseUrl): void
    {
        $this->baseUrl = $baseUrl;
    }

    public function getExtraConfig(): ?array
    {
        return $this->extraConfig;
    }

    public function setExtraConfig(?array $extraConfig): void
    {
        $this->extraConfig = $extraConfig;
    }

    /**
     * 开放平台预设列表 + baseUrl（供 chat 解析，忽略传入参数按图索骥）。
     */
    public static function platformDefaults(): array
    {
        return [
            'deepseek' => 'https://api.deepseek.com/v1',
            'openai' => 'https://api.openai.com/v1',
            'qwen' => 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            'kimi' => 'https://api.moonshot.cn/v1',
        ];
    }

    /**
     * Resolve the effective base URL (custom platform wins with its own baseUrl).
     */
    public function resolveBaseUrl(): ?string
    {
        $defaults = self::platformDefaults();

        if ('custom' === $this->getPlatformType() || !empty($this->baseUrl)) {
            return $this->baseUrl ?: null;
        }

        return $defaults[$this->getPlatformType()] ?? null;
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

    public function getTtsEngine(): ?string
    {
        return $this->ttsEngine;
    }

    public function setTtsEngine(?string $ttsEngine): void
    {
        $this->ttsEngine = $ttsEngine;
    }

    public function getVoiceId(): ?string
    {
        return $this->voiceId;
    }

    public function setVoiceId(?string $voiceId): void
    {
        $this->voiceId = $voiceId;
    }

    public function getRate(): ?float
    {
        return $this->rate;
    }

    public function setRate(?float $rate): void
    {
        $this->rate = $rate;
    }

    public function getPitch(): ?float
    {
        return $this->pitch;
    }

    public function setPitch(?float $pitch): void
    {
        $this->pitch = $pitch;
    }

    public function getAvatarType(): ?string
    {
        return $this->avatarType;
    }

    public function setAvatarType(?string $avatarType): void
    {
        $this->avatarType = $avatarType;
    }

    public function getAvatarAsset(): ?string
    {
        return $this->avatarAsset;
    }

    public function setAvatarAsset(?string $avatarAsset): void
    {
        $this->avatarAsset = $avatarAsset;
    }

    public function getTtsAppId(): ?string
    {
        return $this->ttsAppId;
    }

    public function setTtsAppId(?string $ttsAppId): void
    {
        $this->ttsAppId = $ttsAppId;
    }

    public function getTtsToken(): ?string
    {
        return $this->ttsToken;
    }

    public function setTtsToken(?string $ttsToken): void
    {
        $this->ttsToken = $ttsToken;
    }

    public function getKind(): ?string
    {
        return $this->kind ?: 'model';
    }

    public function setKind(?string $kind): void
    {
        $this->kind = $kind;
    }
}