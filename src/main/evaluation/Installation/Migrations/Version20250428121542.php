<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/04/28 12:15:44
 */
final class Version20250428121542 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE UNIQUE INDEX unique_sequence_assignment ON claro_evaluation_sequence_assignment (sequence_id, role_id)
        ');
        $this->addSql('
            ALTER TABLE innova_path 
            ADD pagination VARCHAR(255) NOT NULL
        ');

        $this->addSql('
            UPDATE innova_path SET pagination = "all"
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE innova_path 
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
