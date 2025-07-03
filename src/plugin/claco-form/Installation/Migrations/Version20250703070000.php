<?php

namespace Claroline\ClacoFormBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250703070000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_resource_rights AS r
            LEFT JOIN claro_resource_node AS n ON r.resourceNode_id = n.id
            SET r.mask = r.mask - 62
            WHERE (r.mask & 64) = 64
              AND n.mime_type = "custom/claroline_claco_form"
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
