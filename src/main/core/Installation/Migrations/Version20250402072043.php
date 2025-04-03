<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/04/02 07:20:44
 */
final class Version20250402072043 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_group 
            DROP is_locked,
            ADD organization_id INT DEFAULT NULL, 
            ADD everyone TINYINT(1) DEFAULT 0 NOT NULL
        ');

        $this->addSql('
            UPDATE claro_group SET everyone = 1 WHERE entity_name = "ROLE_USER" 
        ');

        $this->addSql('
            ALTER TABLE claro_group 
            ADD CONSTRAINT FK_E7C393D732C8A3DE FOREIGN KEY (organization_id) 
            REFERENCES claro__organization (id)
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_E7C393D732C8A3DE ON claro_group (organization_id)
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_group 
            DROP FOREIGN KEY FK_E7C393D732C8A3DE
        ');
        $this->addSql('
            DROP INDEX IDX_E7C393D732C8A3DE ON claro_group
        ');
        $this->addSql('
            ALTER TABLE claro_group 
            DROP organization_id, 
            DROP everyone,
            ADD is_locked TINYINT(1) DEFAULT 0 NOT NULL
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
