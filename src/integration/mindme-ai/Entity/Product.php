<?php

namespace Claroline\MindMeAiBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Unified product dimension for selling resources & courses (route B).
 *
 * Independent table (does NOT modify Resource/Course structures). A resource
 * or course can be published into MULTIPLE products (different code/price/
 * description). Pricing semantics align with Course.price (AbstractTraining).
 *
 * targetType + targetId is a loose reference (no FK), aligned with
 * mindme-billing Order.trainingType/trainingId.
 *
 * No approval workflow: status is always APPROVED (field kept for future use).
 */
#[ORM\Entity]
#[ORM\Table(name: 'claro_mindme_ai_product')]
#[ORM\Index(name: 'idx_product_target', columns: ['target_type', 'target_id'])]
#[ORM\Index(name: 'idx_product_status', columns: ['status'])]
class Product
{
    use Id;
    use Uuid;

    /** 'resource' | 'course' */
    #[ORM\Column(name: 'target_type', type: Types::STRING, length: 20)]
    private string $targetType;

    #[ORM\Column(name: 'target_id', type: Types::INTEGER)]
    private int $targetId;

    /** Product code (unique, aligns with Course.code). */
    #[ORM\Column(type: Types::STRING, length: 64, unique: true)]
    private string $code;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $price = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    /** Always APPROVED (no approval workflow). */
    #[ORM\Column(type: Types::STRING, length: 20)]
    private string $status = ProductStatus::APPROVED;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'creator_id', nullable: true, onDelete: 'SET NULL')]
    private ?User $creator = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->refreshUuid();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getTargetType(): string
    {
        return $this->targetType;
    }

    public function setTargetType(string $targetType): void
    {
        $this->targetType = $targetType;
    }

    public function getTargetId(): int
    {
        return $this->targetId;
    }

    public function setTargetId(int $targetId): void
    {
        $this->targetId = $targetId;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function setCode(string $code): void
    {
        $this->code = $code;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): void
    {
        $this->price = $price;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): void
    {
        $this->creator = $creator;
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
