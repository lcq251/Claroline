<?php

namespace Claroline\OpenBadgeBundle\Installation\Updater;

use Claroline\CoreBundle\Manager\OrganizationManager;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;

class Updater150000 extends Updater
{
    public function __construct(
        private readonly Connection $connection,
        private readonly OrganizationManager $organizationManager
    ) {
    }

    public function postUpdate(): void
    {
        $this->linkBadgesToOrganizations();
    }

    private function linkBadgesToOrganizations(): void
    {
        $organization = $this->organizationManager->getDefault(true);

        $updateQuery = $this->connection->prepare('
            UPDATE claro__open_badge_badge_class 
            SET issuer_id = :default_organization_id 
            WHERE issuer_id IS NULL AND workspace_id IS NULL 
        ');

        $updateQuery->bindValue('default_organization_id', $organization->getId());
        $updateQuery->executeQuery();
    }
}
