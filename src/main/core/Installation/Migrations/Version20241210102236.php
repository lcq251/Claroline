<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/12/10 10:22:43
 */
final class Version20241210102236 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_ordered_tool 
            DROP showIcon, 
            DROP fullscreen
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_ordered_tool 
            ADD showIcon TINYINT(1) DEFAULT 0 NOT NULL, 
            ADD fullscreen TINYINT(1) NOT NULL
        ');
    }
}
