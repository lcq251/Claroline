<?php

namespace Claroline\AnnouncementBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/07/17 07:32:36
 */
final class Version20250717073235 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_announcement 
            CHANGE creation_date createdAt DATETIME DEFAULT NULL, 
            ADD updatedAt DATETIME DEFAULT NULL
        ');

        $this->addSql('
            UPDATE claro_announcement SET updatedAt = createdAt 
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_announcement 
            CHANGE createdAt creation_date DATETIME NOT NULL, 
            DROP updatedAt
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
