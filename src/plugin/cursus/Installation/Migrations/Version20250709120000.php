<?php

namespace Claroline\CursusBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250709120000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_cursusbundle_course_session AS s
            LEFT JOIN claro_cursusbundle_course AS c ON s.course_id = c.id
            SET s.workspace_id = c.workspace_id
            WHERE s.workspace_id IS NULL
              AND c.workspace_id IS NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
