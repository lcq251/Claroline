<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Repository;

use Claroline\AppBundle\Repository\UniqueValueFinder;
use Claroline\CursusBundle\Entity\Event;
use Claroline\CursusBundle\Entity\Registration\AbstractRegistration;
use Doctrine\ORM\EntityRepository;

class EventRepository extends EntityRepository
{
    use UniqueValueFinder;

    public function countParticipants(Event $event): array
    {
        return [
            'tutors' => $this->countTutors($event),
            'learners' => $this->countLearners($event),
        ];
    }

    public function countTutors(Event $event): int
    {
        return $this->countUsers($event, AbstractRegistration::TUTOR);
    }

    public function countLearners(Event $event): int
    {
        return $this->countUsers($event, AbstractRegistration::LEARNER);
    }

    private function countUsers(Event $event, string $type): int
    {
        return (int) $this->getEntityManager()
            ->createQuery('
                SELECT COUNT(su) 
                FROM Claroline\CursusBundle\Entity\Registration\EventUser AS su
                LEFT JOIN su.user AS u
                WHERE su.type = :registrationType
                  AND su.event = :event
                  AND (su.confirmed = 1 AND su.validated = 1)
                  AND u.disabled = false AND u.isRemoved = false AND u.technical = false
            ')
            ->setParameters([
                'registrationType' => $type,
                'event' => $event,
            ])
            ->getSingleScalarResult();
    }
}
