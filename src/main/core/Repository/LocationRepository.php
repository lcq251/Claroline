<?php

namespace Claroline\CoreBundle\Repository;

use Doctrine\ORM\EntityRepository;

class LocationRepository extends EntityRepository
{
    public function findWithNoOrganization(): iterable
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT DISTINCT l
                FROM Claroline\CoreBundle\Entity\Location AS l
                LEFT JOIN l.organizations AS o
                WHERE o IS NULL
            ')
            ->toIterable();
    }
}
