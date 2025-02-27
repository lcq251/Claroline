<?php

namespace Claroline\EvaluationBundle\Repository\Sequence;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\EvaluationBundle\Entity\Sequence\Assignment;
use Doctrine\ORM\EntityRepository;

class AssignmentRepository extends EntityRepository
{
    /** @return Assignment[] */
    public function findByWorkspaceAndUser(Workspace $workspace, User $user, bool $onlyRequired = false): array
    {
        $roles = $user->getRoles();

        $query = '
            SELECT a
            FROM Claroline\EvaluationBundle\Entity\Sequence\Assignment AS a
            LEFT JOIN Claroline\CoreBundle\Entity\Role AS r WITH (a.role = r)
            LEFT JOIN a.sequence AS s
            WHERE s.workspace = :workspace
              AND s.published = 1
              AND r.name IN (:roles)
       ';

        if ($onlyRequired) {
            $query .= ' AND a.required = 1';
        }

        return $this->getEntityManager()
            ->createQuery($query)
            ->setParameter('workspace', $workspace)
            ->setParameter('roles', $roles)
            ->getResult();
    }
}
