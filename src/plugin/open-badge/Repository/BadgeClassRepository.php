<?php

namespace Claroline\OpenBadgeBundle\Repository;

use Doctrine\ORM\EntityRepository;

class BadgeClassRepository extends EntityRepository
{
    public function findWithNoOrganization(): iterable
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT DISTINCT b
                FROM Claroline\OpenBadgeBundle\Entity\BadgeClass AS b
                WHERE b.issuer IS NULL
            ')
            ->toIterable();
    }
}
