<?php

namespace Claroline\AuthenticationBundle\Repository;

use Claroline\AppBundle\Persistence\Repository\AbstractRepository;
use Claroline\AuthenticationBundle\Entity\ThirdPartyUser;

/**
 * @extends AbstractRepository<ThirdPartyUser>
 */
class ThirdPartyUserRepository extends AbstractRepository
{
    /**
     * Find a ThirdPartyUser by platform and platform ID.
     */
    public function findByPlatformId(string $platform, string $platformId): ?ThirdPartyUser
    {
        return $this->findOneBy([
            'platform' => $platform,
            'platformId' => $platformId,
        ]);
    }
}
