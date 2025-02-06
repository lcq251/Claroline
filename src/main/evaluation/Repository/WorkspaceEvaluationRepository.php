<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\EvaluationBundle\Repository;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\EvaluationBundle\Library\EvaluationStatus;
use Doctrine\ORM\EntityRepository;

class WorkspaceEvaluationRepository extends EntityRepository
{
    public function findInProgress(Workspace $workspace): array
    {
        return $this->createQueryBuilder('we')
            ->where('we.status IN (:status)')
            ->andWhere('we.workspace = :workspace')
            ->setParameter('status', [
                EvaluationStatus::NOT_ATTEMPTED,
                EvaluationStatus::INCOMPLETE,
            ])
            ->setParameter('workspace', $workspace)
            ->getQuery()
            ->getResult();
    }
}
