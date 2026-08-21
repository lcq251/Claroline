<?php

namespace Claroline\MindMeAiBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Resource pricing dimension - 独立数据结构 (new entity + new table).
 * 
 * Links a ResourceNode to a price/currency/description tuple.
 * Does NOT modify existing AiLesson/ResourceNode entity structures.
 * 
 * Pricing semantics reference:
 * - pricing.price = price value
 * - pricing.description = detailed description
 */
#[ORM\Entity]
#[ORM\Table(name: 'claro_mindme_ai_resource_pricing')]
class ResourcePricing
{
    use Id;
    use Uuid;

    /**
     * Associated resource node (one-to-one, onDelete CASCADE).
     */
    #[ORM\OneToOne(targetEntity: ResourceNode::class, inversedBy: 'pricing', cascade: ['persist'])]
    #[ORM\JoinColumn(name: 'resource_node_id', referencedColumnName: 'id', onDelete: 'CASCADE', unique: true)]
    private ?ResourceNode $resourceNode = null;

    /**
     * Price value (nullable, can be 0 or null for free resources).
     */
    #[ORM\Column(name: 'price', type: Types::FLOAT, nullable: true)]
    private ?float $price = null;

    /**
     * Currency code (ISO 4217, default CNY).
     */
    #[ORM\Column(name: 'currency', type: Types::STRING, length: 3, options: ['default' => 'CNY'])]
    private string $currency = 'CNY';

    /**
     * Description of the pricing (nullable).
     */
    #[ORM\Column(name: 'description', type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function getResourceNode(): ?ResourceNode
    {
        return $this->resourceNode;
    }

    public function setResourceNode(?ResourceNode $resourceNode): void
    {
        $this->resourceNode = $resourceNode;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): void
    {
        $this->price = $price;
    }

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): void
    {
        $this->currency = $currency;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }
}
