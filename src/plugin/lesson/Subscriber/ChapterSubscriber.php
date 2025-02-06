<?php

namespace Icap\LessonBundle\Subscriber;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\Crud\UpdateEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\FileManager;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Repository\ChapterRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ChapterSubscriber implements EventSubscriberInterface
{
    private ChapterRepository $chapterRepository;

    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly ObjectManager $om,
        private readonly Crud $crud,
        private readonly FileManager $fileManager
    ) {
        $this->chapterRepository = $om->getRepository(Chapter::class);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::PRE_CREATE, Chapter::class) => 'preCreate',
            CrudEvents::getEventName(CrudEvents::POST_CREATE, Chapter::class) => 'postCreate',
            CrudEvents::getEventName(CrudEvents::PRE_UPDATE, Chapter::class) => 'preUpdate',
            CrudEvents::getEventName(CrudEvents::PRE_DELETE, Chapter::class) => 'preDelete',
            CrudEvents::getEventName(CrudEvents::POST_DELETE, Chapter::class) => 'postDelete',
        ];
    }

    public function preCreate(CreateEvent $event): void
    {
        /** @var Chapter $chapter */
        $chapter = $event->getObject();

        $chapter->setCreatedAt(new \DateTime());
        $chapter->setUpdatedAt(new \DateTime());

        // set the creator of the resource
        $user = $this->tokenStorage->getToken()?->getUser();
        if ($user instanceof User) {
            $chapter->setCreator($user);
        }
    }

    public function postCreate(CreateEvent $event): void
    {
        /** @var Chapter $chapter */
        $chapter = $event->getObject();

        if ($chapter->getPoster()) {
            $this->fileManager->linkFile(Chapter::class, $chapter->getUuid(), $chapter->getPoster());
        }
    }

    public function preUpdate(UpdateEvent $event): void
    {
        /** @var Chapter $chapter */
        $chapter = $event->getObject();

        $chapter->setUpdatedAt(new \DateTime());
    }

    public function postUpdate(UpdateEvent $event): void
    {
        /** @var Chapter $chapter */
        $chapter = $event->getObject();
        $oldData = $event->getOldData();

        $this->fileManager->updateFile(
            Chapter::class,
            $chapter->getUuid(),
            $chapter->getPoster(),
            !empty($oldData['poster']) ? $oldData['poster'] : null
        );
    }

    public function preDelete(DeleteEvent $event): void
    {
        /** @var Chapter $chapter */
        $chapter = $event->getObject();

        $children = $this->chapterRepository->children($chapter, true);

        $this->om->startFlushSuite();
        foreach ($children as $child) {
            $this->crud->delete($child, [Crud::NO_PERMISSIONS]);
        }
        $this->om->endFlushSuite();
    }

    public function postDelete(DeleteEvent $event): void
    {
        /** @var Chapter $chapter */
        $chapter = $event->getObject();

        if ($chapter->getPoster()) {
            $this->fileManager->unlinkFile(Chapter::class, $chapter->getUuid(), $chapter->getPoster());
        }
    }
}
