<?php

namespace Claroline\ClacoFormBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\ClacoFormBundle\Repository\EntryUserRepository;
use Claroline\CoreBundle\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_clacoformbundle_entry_user')]
#[ORM\UniqueConstraint(name: 'clacoform_unique_entry_user', columns: ['entry_id', 'user_id'])]
#[ORM\Entity(repositoryClass: EntryUserRepository::class)]
class EntryUser
{
    use Id;
    use Uuid;

    #[ORM\JoinColumn(name: 'entry_id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Entry::class, inversedBy: 'entryUsers')]
    private ?Entry $entry = null;

    #[ORM\JoinColumn(name: 'user_id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $user = null;

    #[ORM\Column(name: 'shared', type: Types::BOOLEAN)]
    private bool $shared = false;

    #[ORM\Column(name: 'notify_edition', type: Types::BOOLEAN)]
    private bool $notifyEdition = false;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function getEntry(): ?Entry
    {
        return $this->entry;
    }

    public function setEntry(Entry $entry): void
    {
        $this->entry = $entry;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function isShared(): bool
    {
        return $this->shared;
    }

    public function setShared(bool $shared): void
    {
        $this->shared = $shared;
    }

    public function getNotifyEdition(): bool
    {
        return $this->notifyEdition;
    }

    public function setNotifyEdition(bool $notifyEdition): void
    {
        $this->notifyEdition = $notifyEdition;
    }
}
