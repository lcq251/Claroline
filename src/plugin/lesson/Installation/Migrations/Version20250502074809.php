<?php

namespace Icap\LessonBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/05/02 07:48:09
 */
final class Version20250502074809 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE icap__lesson 
            ADD pagination VARCHAR(255) NOT NULL
        ');

        $this->addSql('
            UPDATE icap__lesson SET pagination = "all"
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE icap__lesson 
            DROP pagination
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
