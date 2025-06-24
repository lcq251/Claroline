<?php

namespace Claroline\TransferBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250611160000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // import tool rights
        $this->addSql('
            UPDATE claro_tool_rights AS r
            LEFT JOIN claro_ordered_tool AS t ON (r.ordered_tool_id = t.id)
            SET r.mask = r.mask - 16
            WHERE tool_name = "import"
              AND (r.mask & 16) = 16
        ');

        $this->addSql('
            UPDATE claro_tool_rights AS r
            LEFT JOIN claro_ordered_tool AS t ON (r.ordered_tool_id = t.id)
            SET r.mask = r.mask + 8
            WHERE tool_name = "import"
              AND (r.mask & 8) = 8
        ');

        // export tool rights
        $this->addSql('
            UPDATE claro_tool_rights AS r
            LEFT JOIN claro_ordered_tool AS t ON (r.ordered_tool_id = t.id)
            SET r.mask = r.mask + 16
            WHERE tool_name = "export"
              AND (r.mask & 16) = 16
        ');

        $this->addSql('
            UPDATE claro_tool_rights AS r
            LEFT JOIN claro_ordered_tool AS t ON (r.ordered_tool_id = t.id)
            SET r.mask = r.mask + 8
            WHERE tool_name = "export"
              AND (r.mask & 8) = 8
        ');

        $this->addSql('
            UPDATE claro_tool_rights AS r
            LEFT JOIN claro_ordered_tool AS t ON (r.ordered_tool_id = t.id)
            SET r.mask = r.mask - 24
            WHERE tool_name = "export"
              AND (r.mask & 32) = 32
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
