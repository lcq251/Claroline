<?php

namespace Icap\LessonBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/05 01:34:54
 */
final class Version20250205133448 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE icap__lesson 
            ADD navigation TINYINT(1) NOT NULL
        ');

        $this->addSql('
            UPDATE icap__lesson SET navigation = true
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE icap__lesson 
            DROP navigation
        ');
    }
}
