<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/07 10:27:58
 */
final class Version20241107102757 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_workspace  
            DROP allowed_ips, 
            CHANGE score_total score_total DOUBLE PRECISION DEFAULT 100 NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            ALTER TABLE claro_workspace 
            ADD allowed_ips JSON DEFAULT NULL, 
            CHANGE score_total score_total DOUBLE PRECISION DEFAULT '100' NOT NULL
        ");
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
