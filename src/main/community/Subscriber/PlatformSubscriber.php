<?php

namespace Claroline\CommunityBundle\Subscriber;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Event\Client\ConfigureEvent;
use Claroline\AppBundle\Event\ClientEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Entity\UserProfile;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class PlatformSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ClientEvents::CONFIGURE => 'onClientConfig',
        ];
    }

    public function onClientConfig(ConfigureEvent $event): void
    {
        $userProfiles = $this->om->getRepository(UserProfile::class)->findAll();
        if (!empty($userProfiles)) {
            $event->setParameters([
                'userProfile' => $this->serializer->serialize($userProfiles[0]),
            ]);
        }
    }
}
