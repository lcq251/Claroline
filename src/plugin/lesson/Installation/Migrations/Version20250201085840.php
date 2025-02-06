<?php

namespace Icap\LessonBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/01 08:58:51
 */
final class Version20250201085840 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_resource_node AS n
            LEFT JOIN icap__lesson AS l ON (l.resourceNode_id = n.id)
            SET n.description_html = l.description
            WHERE l.id IS NOT NULL
              AND l.description IS NOT NULL
              AND l.description != ""
        ');

        $this->addSql('
            ALTER TABLE icap__lesson 
            DROP description
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE icap__lesson 
            ADD description LONGTEXT DEFAULT NULL
        ');
    }
}
