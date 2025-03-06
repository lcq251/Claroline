<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/27 01:47:46
 */
final class Version20250306100000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE `innova_path_progression` SET progression_status = "not_attempted" WHERE progression_status = "unseen" OR progression_status = "to_do"
        ');

        $this->addSql('
            UPDATE `innova_path_progression` SET progression_status = "completed" WHERE progression_status = "seen" OR progression_status = "done" OR progression_status = "to_review"
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
