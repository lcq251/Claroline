<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Repository;

use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use Doctrine\ORM\EntityRepository;

class EvidenceRepository extends EntityRepository
{
    public function findByUserAndBadge(User $user, BadgeClass $badge): array
    {
        return $this->createQueryBuilder('e')
            ->leftJoin('e.rule', 'r')
            ->leftJoin('r.badge', 'b')
            ->where('e.user = :user')
            ->andWhere('b = :badge')
            ->setParameter('user', $user)
            ->setParameter('badge', $badge)
            ->getQuery()
            ->getResult();
    }
}
