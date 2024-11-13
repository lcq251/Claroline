<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CommunityBundle\Repository;

use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use Claroline\CoreBundle\Entity\Facet\FieldFacetValue;
use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\EntityRepository;

class UserProfileRepository extends EntityRepository
{
    /**
     * @return FieldFacet[]
     */
    public function findFields(): array
    {
        $dql = '
            SELECT ff
            FROM Claroline\CoreBundle\Entity\Facet\FieldFacet ff
            WHERE ff.panelFacet IS NOT NULL
        ';

        return $this->getEntityManager()
            ->createQuery($dql)
            ->getResult()
        ;
    }

    /**
     * @return FieldFacetValue[]
     */
    public function findFieldValues(User $user): array
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT fv
                FROM Claroline\CoreBundle\Entity\Facet\FieldFacetValue fv
                LEFT JOIN fv.fieldFacet AS f
                WHERE fv.user = :user
                  AND f.panelFacet IS NOT NULL
            ')
            ->setParameter('user', $user)
            ->getResult()
        ;
    }
}
