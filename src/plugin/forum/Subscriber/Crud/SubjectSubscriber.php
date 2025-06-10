<?php

namespace Claroline\ForumBundle\Subscriber\Crud;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\Crud\UpdateEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\ForumBundle\Entity\Subject;
use Claroline\ForumBundle\Messenger\NotifyUsersOnMessageCreated;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class SubjectSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly MessageBusInterface $messageBus,
        private readonly ObjectManager $om,
        private readonly FileManager $fileManager
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::PRE_CREATE, Subject::class) => 'preCreate',
            CrudEvents::getEventName(CrudEvents::POST_CREATE, Subject::class) => 'postCreate',
            CrudEvents::getEventName(CrudEvents::PRE_UPDATE, Subject::class) => 'preUpdate',
            CrudEvents::getEventName(CrudEvents::POST_UPDATE, Subject::class) => 'postUpdate',
            CrudEvents::getEventName(CrudEvents::POST_DELETE, Subject::class) => 'postDelete',
        ];
    }

    public function preCreate(CreateEvent $event): void
    {
        /** @var Subject $subject */
        $subject = $event->getObject();
        $subject->setCreatedAt(new \DateTime());
        $subject->setUpdatedAt(new \DateTime());

        if (empty($subject->getCreator())) {
            $subject->setCreator($this->tokenStorage->getToken()?->getUser());
        }
    }

    /**
     * Send notifications after creation.
     */
    public function postCreate(CreateEvent $event): void
    {
        /** @var Subject $subject */
        $subject = $event->getObject();

        if ($subject->getPoster()) {
            $this->fileManager->linkFile(Subject::class, $subject->getUuid(), $subject->getPoster()->getUrl());
        }

        $message = $subject->getFirstMessage();
        if ($message) {
            // hacky: when we are in a flushSuite (e.g., copy), the messenger will fail because the message does not exist
            $this->om->forceFlush();
            $this->messageBus->dispatch(new NotifyUsersOnMessageCreated($message->getId()));
        }
    }

    public function preUpdate(UpdateEvent $event): void
    {
        /** @var Subject $subject */
        $subject = $event->getObject();

        $subject->setUpdatedAt(new \DateTime());
    }

    public function postUpdate(UpdateEvent $event): void
    {
        /** @var Subject $subject */
        $subject = $event->getObject();
        $oldData = $event->getOldData();

        $this->fileManager->updateFile(
            Subject::class,
            $subject->getUuid(),
            !empty($subject->getPoster()) ? $subject->getPoster()->getUrl() : null,
            !empty($oldData['poster']) ? $oldData['poster'] : null
        );
    }

    public function postDelete(DeleteEvent $event): void
    {
        /** @var Subject $subject */
        $subject = $event->getObject();

        if ($subject->getPoster()) {
            $this->fileManager->unlinkFile(Subject::class, $subject->getUuid(), $subject->getPoster()->getUrl());
        }
    }
}
