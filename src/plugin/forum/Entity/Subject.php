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
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

#[ORM\Table(name: 'claro_forum_subject')]
#[ORM\Entity]
class Subject
{
    use Id;
    use Uuid;

    #[ORM\Column]
    private ?string $title = null;

    #[ORM\Column(name: 'created', type: Types::DATETIME_MUTABLE)]
    #[Gedmo\Timestampable(on: 'create')]
    private ?\DateTimeInterface $creationDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Gedmo\Timestampable(on: 'update')]
    private ?\DateTimeInterface $updated = null;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Forum::class, inversedBy: 'subjects')]
    private ?Forum $forum = null;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'subject')]
    #[ORM\OrderBy(['createdAt' => 'ASC'])]
    private Collection $messages;

    #[ORM\JoinColumn(name: 'user_id', onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $creator = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $sticked = false;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $closed = false;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $flagged = false;

    #[ORM\Column(type: Types::INTEGER)]
    private int $viewCount = 0;

    /**
     * @todo only store file URL
     */
    #[ORM\JoinColumn(name: 'poster_id', referencedColumnName: 'id', onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: PublicFile::class)]
    private ?PublicFile $poster = null;

    public function __construct()
    {
        $this->refreshUuid();

        $this->messages = new ArrayCollection();
        $this->creationDate = new \DateTime();
        $this->updated = new \DateTime();
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function setForum(Forum $forum): void
    {
        $this->forum = $forum;
    }

    public function getForum(): ?Forum
    {
        return $this->forum;
    }

    public function getFirstMessage(): ?Message
    {
        $first = null;
        foreach ($this->messages as $message) {
            if ($message->isFirst()) {
                $first = $message;
                break;
            }
        }

        return $first;
    }

    public function setCreator(User $creator): void
    {
        $this->creator = $creator;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): void
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
        }
    }

    public function setSticked(bool $sticked): void
    {
        $this->sticked = $sticked;
    }

    public function isSticked(): bool
    {
        return $this->sticked;
    }

    public function setCreationDate(\DateTimeInterface $date): void
    {
        $this->creationDate = $date;
    }

    public function setModificationDate(\DateTimeInterface $date): void
    {
        $this->updated = $date;
    }

    public function getModificationDate(): ?\DateTimeInterface
    {
        return $this->updated;
    }

    public function setClosed(bool $isClosed): void
    {
        $this->closed = $isClosed;
    }

    public function isClosed(): bool
    {
        return $this->closed;
    }

    public function setFlagged(bool $flagged): void
    {
        $this->flagged = $flagged;
    }

    public function isFlagged(): bool
    {
        return $this->flagged;
    }

    public function getViewCount(): int
    {
        return $this->viewCount;
    }

    public function setViewCount(int $viewCount): void
    {
        $this->viewCount = $viewCount;
    }

    public function setPoster(?PublicFile $file = null): void
    {
        $this->poster = $file;
    }

    public function getPoster(): ?PublicFile
    {
        return $this->poster;
    }
}
