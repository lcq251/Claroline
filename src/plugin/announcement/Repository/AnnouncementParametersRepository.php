<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AnnouncementBundle\Repository;

use Claroline\AnnouncementBundle\Entity\AnnouncementParameters;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Doctrine\ORM\EntityRepository;

class AnnouncementParametersRepository extends EntityRepository
{
    public function findOneByWorkspace(Workspace $workspace): ?AnnouncementParameters
    {
        $query = $this->getEntityManager()->createQuery('
            SELECT ap 
            FROM Claroline\AnnouncementBundle\Entity\AnnouncementParameters AS ap
            JOIN ap.orderedTool AS t
            WHERE t.contextId = :workspace
        ');

        $query->setParameter('workspace', $workspace->getContextIdentifier());

        return $query->getOneOrNullResult();
    }
}
