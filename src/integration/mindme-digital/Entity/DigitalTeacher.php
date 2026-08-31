<?php

namespace Mindme\DigitalBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Digital Teacher AI resource.
 *
 * This resource is only the *configuration* carrier: model, key, voice and
 * avatar settings. It stores NO conversation history — every visit opens a
 * fresh session whose messages live in the request/component state only
 * (frontend keeps the transcript in memory and sends it back with each turn).
 */
#[ORM\Entity]
#[ORM\Table(name: 'mindme_digital_teacher')]
class DigitalTeacher extends AbstractResource
{
    /** AI model name (e.g. deepseek-chat / doubao-seed) */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $modelName = null;

    /** API key (AES-256-GCM ciphertext via SecretCipher; plaintext never stored) */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $apiKey = null;

    /** Validity end (past this date the AI call is refused) */
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTime $expiresAt = null;

    /** Trial quota fallback is NOT persisted here (per-session, ephemeral); kept for parity. */
    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $usageLimit = null;

    /** Restriction type: none | time | count */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $restrictionType = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTime $startAt = null;

    /** TTS engine: cloud | edge | selfhosted | none */
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

    /** OpenAI-compatible Chat Completions base URL (e.g. ARK v3 / DeepSeek v1) */
    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $apiBaseUrl = null;

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

    public function getApiBaseUrl(): ?string
    {
        return $this->apiBaseUrl;
    }

    public function setApiBaseUrl(?string $apiBaseUrl): void
    {
        $this->apiBaseUrl = $apiBaseUrl;
    }

    public function isExpired(): bool
    {
        return null !== $this->expiresAt && $this->expiresAt < new \DateTime();
    }
}
