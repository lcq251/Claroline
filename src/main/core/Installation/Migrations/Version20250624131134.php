<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/06/24 01:11:36
 */
final class Version20250624131134 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_group 
            DROP FOREIGN KEY FK_E7C393D732C8A3DE
        ');
        $this->addSql('
            ALTER TABLE claro_group 
            ADD CONSTRAINT FK_E7C393D732C8A3DE FOREIGN KEY (organization_id) 
            REFERENCES claro__organization (id) 
            ON DELETE SET NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_group 
            DROP FOREIGN KEY FK_E7C393D732C8A3DE
        ');
        $this->addSql('
            ALTER TABLE claro_group 
            ADD CONSTRAINT FK_E7C393D732C8A3DE FOREIGN KEY (organization_id) 
            REFERENCES claro__organization (id) ON UPDATE NO ACTION 
            ON DELETE CASCADE
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
