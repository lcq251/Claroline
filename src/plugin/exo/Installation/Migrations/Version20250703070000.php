<?php

namespace UJM\ExoBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250703070000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_resource_rights AS r
            LEFT JOIN claro_resource_node AS n ON r.resourceNode_id = n.id
            SET r.mask = r.mask - 64
            WHERE (r.mask & 128) = 128
              AND n.mime_type = "custom/ujm_exercise"
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
