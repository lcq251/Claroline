<?php

namespace Claroline\CommunityBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250611160000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_tool_rights AS r
            LEFT JOIN claro_ordered_tool AS t ON (r.ordered_tool_id = t.id)
            SET r.mask = r.mask - 16
            WHERE tool_name = "community"
              AND (r.mask & 16) = 16
              AND (r.mask & 8) = 8
        ');

        // give FOLLOW rights to user with the deleted SHOW_ACTIVITY right
        $this->addSql('
            UPDATE claro_tool_rights AS r
            LEFT JOIN claro_ordered_tool AS t ON (r.ordered_tool_id = t.id)
            SET r.mask = r.mask - 8
            WHERE tool_name = "community"
              AND (r.mask & 16) = 16
              AND (r.mask & 8) != 8
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
