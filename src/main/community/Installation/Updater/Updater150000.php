<?php

namespace Claroline\CommunityBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Component\Tool\OrganizationsTool;
use Claroline\CoreBundle\Component\Context\AdministrationContext;
use Claroline\CoreBundle\Entity\Organization\Organization;
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

        $organization = $this->organizationManager->getDefault(true);
        $this->linkUsersToOrganizations($organization);
        $this->linkGroupsToOrganizations($organization);

        $this->cleanEveryoneGroup();
    }

    private function addOrganizationTool(): void
    {
        $orderedTool = new OrderedTool();
        $orderedTool->setContextName(AdministrationContext::getName());
        $orderedTool->setName(OrganizationsTool::getName());

        $this->om->persist($orderedTool);
        $this->om->flush();
    }

    private function linkUsersToOrganizations(Organization $defaultOrganization): void
    {
        $updateQuery = $this->connection->prepare('
            INSERT INTO user_organization (user_id, organization_id, is_main, is_manager)
            SELECT u.id AS user_id, :default_organization_id AS organization_id, 1 AS is_main, 0 AS is_manager
            FROM claro_user AS u 
            LEFT JOIN user_organization AS uo ON u.id = uo.user_id 
            WHERE uo.organization_id IS NULL
        ');

        $updateQuery->bindValue('default_organization_id', $defaultOrganization->getId());
        $updateQuery->executeQuery();
    }

    private function linkGroupsToOrganizations(Organization $defaultOrganization): void
    {
        $updateQuery = $this->connection->prepare('
            UPDATE claro_group AS g SET g.organization_id = (
                SELECT MIN(organization_id)
                FROM group_organization AS go
                WHERE go.group_id = g.id
            ) WHERE g.organization_id IS NULL
        ');
        $updateQuery->executeQuery();

        $updateQuery = $this->connection->prepare('
            UPDATE claro_group AS g SET g.organization_id = :default_organization_id WHERE g.organization_id IS NULL
        ');
        $updateQuery->bindValue('default_organization_id', $defaultOrganization->getId());
        $updateQuery->executeQuery();
    }

    /**
     * Removes users from the ROLE_USER group which don't belong to the same organization.
     */
    private function cleanEveryoneGroup(): void
    {
        $deleteQuery = $this->connection->prepare('
            DELETE ug 
            FROM claro_user_group AS ug
            LEFT JOIN claro_group AS g ON g.id = ug.group_id
            WHERE g.entity_name = "ROLE_USER"
              AND NOT EXISTS (
                  SELECT o.id
                  FROM claro__organization AS o
                  LEFT JOIN user_organization AS uo ON o.id = uo.organization_id
                  WHERE o.id = g.organization_id
                    AND uo.user_id = ug.user_id
              )
        ');

        $deleteQuery->executeQuery();
    }
}
