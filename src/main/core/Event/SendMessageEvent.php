<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event;

use Claroline\CoreBundle\Entity\AbstractRoleSubject;
use Claroline\CoreBundle\Entity\User;
use Symfony\Contracts\EventDispatcher\Event;

class SendMessageEvent extends Event
{
    private ?string $content = null;
    private ?string $object = null;
    /** @var AbstractRoleSubject[] */
    private array $receivers;
    private ?User $sender = null;
    private array $attachments = [];

    public function __construct(
        ?string $content = null,
        ?string $object = null,
        ?array $receivers = [],
        ?User $sender = null,
        ?array $attachments = []
    ) {
        $this->content = $content;
        $this->object = $object;
        $this->receivers = $receivers;
        $this->sender = $sender;
        $this->attachments = $attachments;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent($content): void
    {
        $this->content = $content;
    }

    public function getObject(): ?string
    {
        return $this->object;
    }

    public function setObject($object): void
    {
        $this->object = $object;
    }

    public function getReceivers(): array
    {
        return $this->receivers;
    }

    public function setReceivers(array $receivers): void
    {
        $this->receivers = $receivers;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(User $sender): void
    {
        $this->sender = $sender;
    }

    public function getAttachments(): array
    {
        return $this->attachments;
    }

    public function addAttachment($attachment): void
    {
        $this->attachments[] = $attachment;
    }
}
