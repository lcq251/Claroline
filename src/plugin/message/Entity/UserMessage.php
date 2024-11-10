<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MessageBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_user_message')]
class UserMessage
{
    use Id;
    use Uuid;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Message::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Message $message = null;

    #[ORM\Column(name: 'is_removed', type: Types::BOOLEAN)]
    private bool $removed = false;

    #[ORM\Column(name: 'is_read', type: Types::BOOLEAN)]
    private bool $read = false;

    #[ORM\Column(name: 'is_sent', type: Types::BOOLEAN)]
    private bool $sent = false;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function isRead(): bool
    {
        return $this->read;
    }

    public function setRead(bool $isRead): void
    {
        $this->read = $isRead;
    }

    public function isRemoved(): bool
    {
        return $this->removed;
    }

    public function setRemoved(bool $removed): void
    {
        $this->removed = $removed;
    }

    public function isSent(): bool
    {
        return $this->sent;
    }

    public function setSent(bool $isSent): void
    {
        $this->sent = $isSent;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getMessage(): Message
    {
        return $this->message;
    }

    public function setMessage(Message $message): void
    {
        $this->message = $message;
    }
}
