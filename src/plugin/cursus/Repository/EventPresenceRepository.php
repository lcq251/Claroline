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

use Claroline\CoreBundle\Entity\User;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\EventPresence;
use Doctrine\ORM\EntityRepository;

class EventPresenceRepository extends EntityRepository
{
    public function countByCourseAndUser(Course $course, User $user): int
    {
        $dql = '
            SELECT COUNT(ep)
            FROM Claroline\CursusBundle\Entity\EventPresence AS ep
            LEFT JOIN ep.event AS e
            LEFT JOIN e.session AS s
            WHERE s.course = :course
              AND ep.user = :user
              AND ep.status = :status
        ';

        $query = $this->getEntityManager()
            ->createQuery($dql)
            ->setParameter('course', $course)
            ->setParameter('user', $user)
            ->setParameter('status', EventPresence::PRESENT);

        return (int) $query->getSingleScalarResult();
    }

    public function findUsersWithPresences(Course $course, int $nbPresences): array
    {
        $dql = '
            SELECT DISTINCT u
            FROM Claroline\CoreBundle\Entity\User AS u
            WHERE (
                SELECT COUNT(ep)
                FROM Claroline\CursusBundle\Entity\EventPresence AS ep
                LEFT JOIN ep.event AS e
                LEFT JOIN e.session AS s
                WHERE s.course = :course
                  AND ep.user = u
                  AND ep.status = :status
            ) >= :nbPresences
        ';

        $query = $this->getEntityManager()
            ->createQuery($dql)
            ->setParameter('course', $course)
            ->setParameter('nbPresences', $nbPresences)
            ->setParameter('status', EventPresence::PRESENT);

        return $query->getResult();
    }
}
