<?php

namespace Claroline\CommunityBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Component\Tool\OrganizationsTool;
use Claroline\CoreBundle\Component\Context\AdministrationContext;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Manager\OrganizationManager;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;

class Updater150000 extends Updater
{
    public function __construct(
        private readonly Connection $connection,
        private readonly ObjectManager $om,
        private readonly OrganizationManager $organizationManager
    ) {
    }

    public function postUpdate(): void
    {
        $this->addOrganizationTool();
        $this->linkUsersToOrganizations();
    }

    private function addOrganizationTool(): void
    {
        $orderedTool = new OrderedTool();
        $orderedTool->setContextName(AdministrationContext::getName());
        $orderedTool->setName(OrganizationsTool::getName());

        $this->om->persist($orderedTool);
        $this->om->flush();
    }

    private function linkUsersToOrganizations(): void
    {
        $organization = $this->organizationManager->getDefault(true);

        $updateQuery = $this->connection->prepare('
            INSERT INTO user_organization (user_id, organization_id, is_main)
            SELECT u.id AS user_id, :default_organization_id AS organization_id, 1 AS is_main
            FROM claro_user AS u 
            LEFT JOIN user_organization AS uo ON u.id = uo.user_id 
            WHERE uo.organization_id IS NULL
        ');

        $updateQuery->bindValue('default_organization_id', $organization->getId());
        $updateQuery->executeQuery();
    }
}
