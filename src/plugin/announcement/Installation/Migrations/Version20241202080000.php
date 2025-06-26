<?php

namespace Claroline\AnnouncementBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/05/17 07:25:29
 */
final class Version20241202080000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            INSERT INTO claro_ordered_tool
            (uuid, context_name, context_id, tool_name, entity_order, is_public)
            SELECT UUID() as uuid, "workspace" AS context_name, w.uuid, "announcement" AS tool_name, 1 AS entity_order, 0 AS is_public
            FROM claro_workspace AS w
            WHERE w.archived = false
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
