<?php

namespace Claroline\ThemeBundle\Subscriber\Crud;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Event\Crud\UpdateEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\ThemeBundle\Entity\UserPreferences;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class UserSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::PRE_UPDATE, User::class) => 'preUpdate',
        ];
    }

    public function preUpdate(UpdateEvent $event): void
    {
        /** @var User $user */
        $user = $event->getObject();
        $data = $event->getData();

        if (!empty($data['preferences']['theme'])) {
            $preferences = $this->om->getRepository(UserPreferences::class)->findOneBy(['user' => $user]);
            if (empty($preferences)) {
                $preferences = new UserPreferences();
            }

            $this->serializer->deserialize($data['preferences']['theme'], $preferences);
            $this->om->persist($preferences);
        }
    }
}
