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

use Claroline\CoreBundle\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Per-user digital-teacher avatar configuration.
 *
 * Lets each signed-in user personalise their Live2D model / voice / mode.
 * When a user has no row (or a nullable field is empty), the Aiteacher
 * resource defaults are used instead (fallback to the global haru avatar).
 */
#[ORM\Entity]
#[ORM\Table(name: 'mindme_user_avatar')]
class UserAvatar
{
    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', unique: true, nullable: false, onDelete: 'CASCADE')]
    private User $user;

    /** Personal Live2D model URL (ai-avatar-bot data-model). Null = default haru. */
    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $modelUrl = null;

    /** Personal voice identifier (ai-avatar-bot data-voice). Null = default. */
    #[ORM\Column(type: Types::STRING, length: 64, nullable: true)]
    private ?string $voice = null;

    /** Personal widget mode: assistant | companion. Null = default. */
    #[ORM\Column(type: Types::STRING, length: 16, nullable: true)]
    private ?string $mode = null;

    /** Personal avatar fit: half (bust) | full (whole body). */
    #[ORM\Column(type: Types::STRING, length: 8, nullable: true)]
    private ?string $fit = null;

    /** Personal avatar zoom (1–3). */
    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $zoom = null;

    /** Personal avatar display name. */
    #[ORM\Column(type: Types::STRING, length: 64, nullable: true)]
    private ?string $avatarName = null;

    /** Personal welcome text. */
    #[ORM\Column(type: Types::STRING, length: 500, nullable: true)]
    private ?string $welcome = null;

    /** Personal greeting text. */
    #[ORM\Column(type: Types::STRING, length: 500, nullable: true)]
    private ?string $greeting = null;

    /** Personal fallback text. */
    #[ORM\Column(type: Types::STRING, length: 800, nullable: true)]
    private ?string $fallback = null;

    /** Personal suggested questions (JSON array). */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $suggestions = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
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
        return $this->mode;
    }

    public function setMode(?string $mode): void
    {
        $this->mode = $mode;
    }

    public function getFit(): ?string
    {
        return $this->fit;
    }

    public function setFit(?string $fit): void
    {
        $this->fit = $fit;
    }

    public function getZoom(): ?int
    {
        return $this->zoom;
    }

    public function setZoom(?int $zoom): void
    {
        $this->zoom = $zoom;
    }

    public function getAvatarName(): ?string
    {
        return $this->avatarName;
    }

    public function setAvatarName(?string $avatarName): void
    {
        $this->avatarName = $avatarName;
    }

    public function getWelcome(): ?string
    {
        return $this->welcome;
    }

    public function setWelcome(?string $welcome): void
    {
        $this->welcome = $welcome;
    }

    public function getGreeting(): ?string
    {
        return $this->greeting;
    }

    public function setGreeting(?string $greeting): void
    {
        $this->greeting = $greeting;
    }

    public function getFallback(): ?string
    {
        return $this->fallback;
    }

    public function setFallback(?string $fallback): void
    {
        $this->fallback = $fallback;
    }

    public function getSuggestions(): ?array
    {
        return $this->suggestions;
    }

    public function setSuggestions(?array $suggestions): void
    {
        $this->suggestions = $suggestions;
    }
}
