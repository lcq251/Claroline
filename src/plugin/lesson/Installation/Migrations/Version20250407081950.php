<?php

namespace Icap\LessonBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/04/07 08:19:52
 */
final class Version20250407081950 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE icap__lesson CHANGE show_overview show_overview TINYINT(1) DEFAULT 0 NOT NULL, 
            CHANGE show_meta show_meta TINYINT(1) DEFAULT 0 NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE icap__lesson CHANGE show_overview show_overview TINYINT(1) DEFAULT 1 NOT NULL, 
            CHANGE show_meta show_meta TINYINT(1) DEFAULT 1 NOT NULL
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
