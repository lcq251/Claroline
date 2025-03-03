<?php

namespace UJM\ExoBundle\Entity\Item;

use Claroline\AppBundle\Entity\Display\Order;
use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\ORM\Mapping as ORM;

/**
 * A Resource that can help to answer the Item.
 */
#[ORM\Table(name: 'ujm_question_resource')]
#[ORM\Entity]
class ItemResource
{
    use Id;
    use Order;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Item::class, inversedBy: 'resources')]
    private ?Item $question = null;

    /**
     * Linked ResourceNode.
     */
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: ResourceNode::class)]
    protected ?ResourceNode $resourceNode = null;

    public function setQuestion(?Item $question = null): void
    {
        $this->question = $question;
    }

    public function getQuestion(): ?Item
    {
        return $this->question;
    }

    public function setResourceNode(ResourceNode $resourceNode): void
    {
        $this->resourceNode = $resourceNode;
    }

    public function getResourceNode(): ?ResourceNode
    {
        return $this->resourceNode;
    }
}
