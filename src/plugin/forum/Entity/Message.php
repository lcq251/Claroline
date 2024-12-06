<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\AppBundle\Entity\Meta\CreatedAt;
use Claroline\AppBundle\Entity\Meta\Creator;
use Claroline\AppBundle\Entity\Meta\UpdatedAt;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_forum_message')]
#[ORM\Entity]
class Message
{
    use Id;
    use Uuid;
    use Creator;
    use CreatedAt;
    use UpdatedAt;

    #[ORM\Column(name: 'content', type: Types::TEXT)]
    private ?string $content = null;

    #[ORM\ManyToOne(targetEntity: Subject::class, cascade: ['persist'], inversedBy: 'messages')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Subject $subject = null;

    #[ORM\ManyToOne(targetEntity: Message::class, inversedBy: 'children')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Message $parent = null;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'parent')]
    private Collection $children;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $flagged = false;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $first = false;

    public function __construct()
    {
        $this->refreshUuid();

        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();

        $this->children = new ArrayCollection();
    }

    public function setContent(?string $content): void
    {
        $this->content = $content;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setSubject(Subject $subject): void
    {
        $this->subject = $subject;
        $subject->addMessage($this);
    }

    public function getSubject(): ?Subject
    {
        if ($this->getParent()) {
            return $this->getParent()->getSubject();
        }

        return $this->subject;
    }

    public function getForum(): ?Forum
    {
        if ($this->getSubject()) {
            return $this->getSubject()->getForum();
        }

        return null;
    }

    public function setParent(?self $parent = null): void
    {
        $this->parent = $parent;
    }

    public function getParent(): ?Message
    {
        return $this->parent;
    }

    public function getChildren(): Collection
    {
        return $this->children;
    }

    public function setFlagged(bool $bool): void
    {
        $this->flagged = $bool;
    }

    public function isFlagged(): bool
    {
        return $this->flagged;
    }

    public function isFirst(): bool
    {
        return $this->first;
    }

    public function setFirst(bool $isFirst): void
    {
        $this->first = $isFirst;
    }
}
