<?php

namespace UJM\ExoBundle\Library\Model;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\ORM\Mapping as ORM;

/**
 * Gives an entity the ability to hold a content (either by using a ResourceNode or by using raw data).
 */
trait ContentTrait
{
    #[ORM\Column(name: 'data', type: 'text', nullable: true)]
    private ?string $data = null;

    /**
     * A resource node holding the content.
     */
    #[ORM\JoinColumn(name: 'resourceNode_id', referencedColumnName: 'id', nullable: true)]
    #[ORM\ManyToOne(targetEntity: ResourceNode::class)]
    private ?ResourceNode $resourceNode = null;

    public function setData(?string $data): void
    {
        $this->data = $data;
    }

    public function getData(): ?string
    {
        return $this->data;
    }

    public function setResourceNode(?ResourceNode $resourceNode = null): void
    {
        $this->resourceNode = $resourceNode;
    }

    public function getResourceNode(): ?ResourceNode
    {
        return $this->resourceNode;
    }
}
