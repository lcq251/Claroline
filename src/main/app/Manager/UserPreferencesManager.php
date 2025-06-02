<?php

namespace Claroline\AppBundle\Manager;

use Claroline\AppBundle\Event\Client\UserPreferencesEvent;
use Claroline\AppBundle\Event\ClientEvents;
use Claroline\CoreBundle\Entity\User;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class UserPreferencesManager
{
    public function __construct(
        private readonly EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function getPreferences(?User $user = null): array
    {
        $event = new UserPreferencesEvent($user);
        $this->eventDispatcher->dispatch($event, ClientEvents::USER_PREFERENCES);

        return $event->getPreferences();
    }
}
