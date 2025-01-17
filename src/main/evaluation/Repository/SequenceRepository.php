<?php

namespace Claroline\EvaluationBundle\Repository;

use Claroline\AppBundle\Repository\UniqueValueFinder;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceUserEvaluation;
use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\EntityRepository;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;

class SequenceRepository extends EntityRepository
{
    use UniqueValueFinder;

    /**
     * Find all the Path using the $resourceNode as an overview resource or a primary resource of a Step.
     *
     * @return Sequence[]
     */
    public function findByRequiredResource(ResourceNode $resourceNode): array
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT p
                FROM Claroline\EvaluationBundle\Entity\Sequence\Sequence AS p
                LEFT JOIN Claroline\EvaluationBundle\Entity\Sequence\Step AS s WITH (s.path = p)
                LEFT JOIN s.resource AS n
                WHERE (s.resource = :resourceNode AND n.required = true) 
                   OR (p.overviewResource = :resourceNode AND n.required = true)
           ')
            ->setParameter('resourceNode', $resourceNode)
            ->getResult();
    }

    /**
     * Find user evaluations for the required resources embedded in a Path as an overview resource or a primary resource of a Step.
     * NB. This is used by the evaluation system of the Path, other embedded resources are not needed in this case.
     *
     * @return ResourceUserEvaluation[]
     */
    public function findRequiredEvaluations(Sequence $sequence, User $user): array
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT e
                FROM Claroline\CoreBundle\Entity\Resource\ResourceUserEvaluation AS e
                LEFT JOIN e.resourceNode AS n
                LEFT JOIN Claroline\EvaluationBundle\Entity\Sequence\Step AS s WITH (s.resource = n)
                LEFT JOIN Claroline\EvaluationBundle\Entity\Sequence\Sequence AS p WITH (p.overviewResource = n)
                WHERE n.required = 1
                  AND e.user = :user
                  AND (s.path = :pathResource OR p = :pathResource)
           ')
            ->setParameter('pathResource', $sequence)
            ->setParameter('user', $user)
            ->getResult();
    }
}
