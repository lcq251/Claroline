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

use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Library\EvaluationStatus;
use Doctrine\ORM\EntityRepository;

class SequenceEvaluationRepository extends EntityRepository
{
    public function findInProgress(Sequence $sequence): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.status IN (:status)')
            ->andWhere('e.sequence = :sequence')
            ->setParameter('status', [
                EvaluationStatus::NOT_ATTEMPTED,
                EvaluationStatus::INCOMPLETE,
            ])
            ->setParameter('sequence', $sequence)
            ->getQuery()
            ->getResult();
    }
}
