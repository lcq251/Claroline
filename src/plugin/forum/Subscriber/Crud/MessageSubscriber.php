<?php

namespace Claroline\ForumBundle\Subscriber\Crud;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\UpdateEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Messenger\NotifyUsersOnMessageCreated;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class MessageSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly MessageBusInterface $messageBus
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::PRE_CREATE, Message::class) => 'preCreate',
            CrudEvents::getEventName(CrudEvents::POST_CREATE, Message::class) => 'postCreate',
            CrudEvents::getEventName(CrudEvents::PRE_UPDATE, Message::class) => 'preUpdate',
        ];
    }

    public function preCreate(CreateEvent $event): void
    {
        /** @var Message $message */
        $message = $event->getObject();

        $message->setCreatedAt(new \DateTime());
        $message->setUpdatedAt(new \DateTime());

        if (empty($message->getCreator())) {
            $message->setCreator($this->tokenStorage->getToken()?->getUser());
        }
    }

    /**
     * Send notifications after creation.
     */
    public function postCreate(CreateEvent $event): void
    {
        /** @var Message $message */
        $message = $event->getObject();

        $this->messageBus->dispatch(new NotifyUsersOnMessageCreated($message->getId()));
    }

    public function preUpdate(UpdateEvent $event): void
    {
        $message = $event->getObject();

        $message->setUpdatedAt(new \DateTime());
    }
}
