<?php

namespace HeVinci\FavouriteBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_resource_favourite')]
#[ORM\UniqueConstraint(columns: ['user_id', 'resource_node_id'])]
#[ORM\Entity]
class ResourceFavourite extends AbstractFavourite
{
    #[ORM\JoinColumn(name: 'resource_node_id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: ResourceNode::class)]
    private ?ResourceNode $resource = null;

    public function setResource(ResourceNode $resourceNode): void
    {
        $this->resource = $resourceNode;
    }

    public function getResource(): ?ResourceNode
    {
        return $this->resource;
    }
}
