<?php

namespace Icap\LessonBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250703070000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // migrate view_internal_note mask
        $this->addSql('
            UPDATE claro_resource_rights AS r
            LEFT JOIN claro_resource_node AS n ON r.resourceNode_id = n.id
            SET r.mask = r.mask + 64
            WHERE (r.mask & 64) = 64
              AND n.mime_type = "custom/icap_lesson"
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
