<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Claroline\AppBundle\Entity\Identifier\Id;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Item\Item;

#[ORM\MappedSuperclass]
abstract class AbstractItem
{
    use Id;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\OneToOne(targetEntity: Item::class)]
    protected ?Item $question = null;

    final public function setQuestion(Item $question): void
    {
        $this->question = $question;

        $question->setInteraction($this);
    }

    public function getQuestion(): ?Item
    {
        return $this->question;
    }

    public function isContentItem(): bool
    {
        return false;
    }
}
