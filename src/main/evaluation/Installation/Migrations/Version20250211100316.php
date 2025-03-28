<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/11 10:03:21
 */
final class Version20250211100316 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE innova_path 
            DROP manual_progression_allowed, 
            CHANGE score_total score_total DOUBLE PRECISION DEFAULT 100 NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            ALTER TABLE innova_path 
            ADD manual_progression_allowed TINYINT(1) NOT NULL,  
            CHANGE score_total score_total DOUBLE PRECISION DEFAULT '100' NOT NULL
        ");
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
