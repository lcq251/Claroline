<?php

namespace Claroline\EvaluationBundle\Repository;

use Claroline\AppBundle\Repository\UniqueValueFinder;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Doctrine\ORM\EntityRepository;

class SequenceRepository extends EntityRepository
{
    use UniqueValueFinder;

    /**
     * Find all the Sequences using the $resourceNode as a primary resource of a Step.
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
                WHERE s.resource = :resourceNode 
                  AND s.required = true
           ')
            ->setParameter('resourceNode', $resourceNode)
            ->getResult();
    }

    /**
     * Find user evaluations for the resources embedded in a Sequence as a primary resource of a Step.
     * NB. This is used by the evaluation system of the Sequence, other embedded resources are not needed in this case.
     *
     * @return ResourceEvaluation[]
     */
    public function findResourceEvaluations(Sequence $sequence, User $user): array
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT e
                FROM Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation AS e
                LEFT JOIN e.resourceNode AS n
                LEFT JOIN Claroline\EvaluationBundle\Entity\Sequence\Step AS s WITH (s.resource = n)
                WHERE e.user = :user
                  AND s.path = :sequence
           ')
            ->setParameter('sequence', $sequence)
            ->setParameter('user', $user)
            ->getResult();
    }
}
