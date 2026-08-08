<?php

namespace Claroline\AuthenticationBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Links a Claroline User to an external third-party platform identity.
 *
 * Supports multiple platform types (wechat, github, azure, etc.) via the
 * "platform" discriminator column. Each User can have one entry per platform.
 *
 * Platform examples:
 *   - wechat:  platformId = openid
 *   - github:  platformId = github user id
 *   - apple:   platformId = apple user identifier
 */
#[ORM\Entity(repositoryClass: Repository\ThirdPartyUserRepository::class)]
#[ORM\Table(name: 'claro_thirdpart_user')]
#[ORM\UniqueConstraint(name: 'unique_platform_id', columns: ['platform', 'platform_id'])]
class ThirdPartyUser
{
    use Id;
    use Uuid;

    /**
     * The Claroline user linked to this third-party identity.
     */
    #[ORM\OneToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    /**
     * Third-party platform name (e.g., 'wechat', 'github', 'apple').
     */
    #[ORM\Column(type: Types::STRING, length: 50)]
    private string $platform;

    /**
     * Unique identifier on the third-party platform (e.g., WeChat openid).
     */
    #[ORM\Column(name: 'platform_id', type: Types::STRING, length: 255)]
    private string $platformId;

    /**
     * Raw response data from the platform's userinfo endpoint.
     */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $rawData = [];

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->refreshUuid();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): void
    {
        $this->user = $user;
    }

    public function getPlatform(): string
    {
        return $this->platform;
    }

    public function setPlatform(string $platform): void
    {
        $this->platform = $platform;
    }

    public function getPlatformId(): string
    {
        return $this->platformId;
    }

    public function setPlatformId(string $platformId): void
    {
        $this->platformId = $platformId;
    }

    public function getRawData(): ?array
    {
        return $this->rawData;
    }

    public function setRawData(?array $rawData): void
    {
        $this->rawData = $rawData;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }
}
