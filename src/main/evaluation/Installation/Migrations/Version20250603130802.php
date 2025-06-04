<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/06/03 01:08:04
 */
final class Version20250603130802 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE innova_path 
            CHANGE score_total score_total DOUBLE PRECISION DEFAULT 100
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            ALTER TABLE innova_path  
            CHANGE score_total score_total DOUBLE PRECISION DEFAULT '100' NOT NULL
        ");
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
