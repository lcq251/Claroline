<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/25 08:52:33
 */
final class Version20250225085226 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE innova_path AS s
            SET s.success_condition = CONCAT(\'{"score": \', s.success_score, \'}\')
            WHERE s.success_score is NOT NULL 
              AND s.success_score != 0
        ');

        $this->addSql('
            UPDATE innova_step AS s
            LEFT JOIN claro_resource_node AS n ON s.resource_id = n.id 
            SET s.required = n.required, s.scored = n.evaluated
            WHERE n.id IS NOT NULL
              AND (n.required = 1 OR n.evaluated = 1)
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE innova_path 
            DROP successCondition
        ');
    }
}
