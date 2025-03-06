<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\EvaluationBundle\Repository\UserEvaluation;

use Claroline\CoreBundle\Entity\User;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Doctrine\ORM\EntityRepository;

class SequenceProgressionRepository extends EntityRepository
{
    public function findBySequenceAndUser(Sequence $sequence, User $user): array
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.step', 's')
            ->where('s.path = :sequence')
            ->andWhere('p.user = :user')
            ->setParameter('sequence', $sequence)
            ->setParameter('user', $user)
            ->getQuery()
            ->getResult();
    }
}
