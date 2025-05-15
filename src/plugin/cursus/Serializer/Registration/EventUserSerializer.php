<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Serializer\Registration;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CursusBundle\Entity\EventPresence;
use Claroline\CursusBundle\Entity\Registration\AbstractUserRegistration;
use Claroline\CursusBundle\Entity\Registration\EventUser;
use Claroline\CursusBundle\Serializer\EventPresenceSerializer;
use Claroline\CursusBundle\Serializer\EventSerializer;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class EventUserSerializer extends AbstractUserSerializer
{
    use SerializerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        UserSerializer $userSerializer,
        private readonly ObjectManager $om,
        private readonly EventSerializer $eventSerializer,
        private readonly EventPresenceSerializer $presenceSerializer
    ) {
        parent::__construct($authorization, $userSerializer);
    }

    public function getClass(): string
    {
        return EventUser::class;
    }

    /**
     * @param EventUser $userRegistration
     */
    public function serialize(AbstractUserRegistration $userRegistration, array $options = []): array
    {
        $presence = $this->om->getRepository(EventPresence::class)->findOneBy([
            'event' => $userRegistration->getEvent(),
            'user' => $userRegistration->getUser(),
        ]);

        return array_merge(parent::serialize($userRegistration, $options), [
            'event' => $this->eventSerializer->serialize($userRegistration->getEvent(), [SerializerInterface::SERIALIZE_MINIMAL]),
            'presence' => $presence ? $this->presenceSerializer->serialize($presence) : null,
        ]);
    }
}
