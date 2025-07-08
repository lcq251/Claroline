<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250708120000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            INSERT IGNORE INTO claro_tool_rights (role_id, ordered_tool_id, mask) VALUES (
                (SELECT r.id AS role_id FROM claro_role AS r WHERE r.name = "ROLE_WS_CREATOR"),
                (SELECT ot.id AS ordered_tool_id FROM claro_ordered_tool AS ot WHERE ot.tool_name = "workspaces" AND context_name = "desktop"),
                1
            )
        ');

        $this->addSql('
            UPDATE claro_tool_rights AS tr
            LEFT JOIN claro_role AS r ON r.id = tr.role_id
            LEFT JOIN claro_ordered_tool AS t ON t.id = tr.ordered_tool_id
            SET tr.mask = tr.mask + 32
            WHERE t.tool_name = "workspaces"
              AND r.name = "ROLE_WS_CREATOR"
        ');
    }

    public function down(Schema $schema): void
    {
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
