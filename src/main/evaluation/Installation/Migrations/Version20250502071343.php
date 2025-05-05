<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/05/02 07:13:44
 */
final class Version20250502071343 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE innova_path 
            ADD objective LONGTEXT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE innova_step 
            ADD objective LONGTEXT DEFAULT NULL, 
            ADD estimatedDuration INT DEFAULT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE innova_path  
            DROP objective
        ');
        $this->addSql('
            ALTER TABLE innova_step 
            DROP objective, 
            DROP estimatedDuration
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
