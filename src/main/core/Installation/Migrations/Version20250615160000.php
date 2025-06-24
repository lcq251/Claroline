<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250615160000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // give FOLLOW rights to user with the EDIT or ADMINISTRATE right
        $this->addSql('
            UPDATE claro_tool_rights AS r
            SET r.mask = r.mask + 8
            WHERE (r.mask & 8) != 8 
              AND ((r.mask & 4) = 4 OR (r.mask & 2) = 2)
        ');

        // remove copy right (moved to EXPORT)
        $this->addSql('
            UPDATE claro_resource_rights AS r
            SET r.mask = r.mask + 4
            WHERE (r.mask & 4) != 4 
              AND (r.mask & 2) = 2
        ');

        $this->addSql('
            UPDATE claro_resource_rights AS r
            SET r.mask = r.mask - 2
            WHERE (r.mask & 2) = 2
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
