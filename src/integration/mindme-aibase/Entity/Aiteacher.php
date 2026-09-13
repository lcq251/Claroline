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

/**
 * Digital teacher resource — an ai-avatar-bot (Live2D voice avatar) front-end.
 *
 * The avatar/voice/lip-sync rendering is owned by ai-avatar-bot; Claroline only
 * stores the widget configuration and references an Aibase resource as the LLM
 * "brain" (model + API key). The old in-entity TTS/avatar fields were dropped
 * when the digital teacher was split out of the Aibase resource.
 */
#[ORM\Entity]
#[ORM\Table(name: 'mindme_aiteacher')]
class Aiteacher extends AbstractResource
{
    /** ai-avatar-bot widget base URL (empty = default /avatar nginx proxy). */
    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $widgetBaseUrl = null;

    /** Linked Aibase resource id acting as the LLM brain (model + API key). */
    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $brainAibaseId = null;

    /** Live2D model URL (ai-avatar-bot data-model). */
    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $modelUrl = null;

    /** Voice identifier (ai-avatar-bot data-voice), e.g. zh-CN-XiaoxiaoNeural. */
    #[ORM\Column(type: Types::STRING, length: 64, nullable: true)]
    private ?string $voice = null;

    /** Widget mode: assistant | companion. */
    #[ORM\Column(type: Types::STRING, length: 16, nullable: true)]
    private ?string $mode = null;

    /** Per-user cumulative call cap (empty = no per-resource cap). */
    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $usageLimit = null;

    public function getWidgetBaseUrl(): ?string
    {
        return $this->widgetBaseUrl;
    }

    public function setWidgetBaseUrl(?string $widgetBaseUrl): void
    {
        $this->widgetBaseUrl = $widgetBaseUrl;
    }

    public function getBrainAibaseId(): ?int
    {
        return $this->brainAibaseId;
    }

    public function setBrainAibaseId(?int $brainAibaseId): void
    {
        $this->brainAibaseId = $brainAibaseId;
    }

    public function getModelUrl(): ?string
    {
        return $this->modelUrl;
    }

    public function setModelUrl(?string $modelUrl): void
    {
        $this->modelUrl = $modelUrl;
    }

    public function getVoice(): ?string
    {
        return $this->voice;
    }

    public function setVoice(?string $voice): void
    {
        $this->voice = $voice;
    }

    public function getMode(): ?string
    {
        return $this->mode ?: 'assistant';
    }

    public function setMode(?string $mode): void
    {
        $this->mode = $mode;
    }

    public function getUsageLimit(): ?int
    {
        return $this->usageLimit;
    }

    public function setUsageLimit(?int $usageLimit): void
    {
        $this->usageLimit = $usageLimit;
    }
}
