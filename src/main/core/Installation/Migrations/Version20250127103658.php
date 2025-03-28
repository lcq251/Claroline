<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/01/27 10:37:06
 */
final class Version20250127103658 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_resource_node 
            DROP showIcon, 
            DROP fullscreen
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_resource_node 
            ADD showIcon TINYINT(1) DEFAULT 1 NOT NULL, 
            ADD fullscreen TINYINT(1) NOT NULL
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
