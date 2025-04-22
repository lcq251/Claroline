<?php

namespace Claroline\CursusBundle\Installation\Migrations;

use Claroline\InstallationBundle\Migrations\Helper\ConditionalMigrationTrait;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/04/17 07:46:22
 */
final class Version20250417074621 extends AbstractMigration
{
    use ConditionalMigrationTrait;

    public function up(Schema $schema): void
    {
        if (!$this->checkTableExists('claro__open_badge_rule', $this->connection)) {
            return;
        }

        $this->addSql('
            UPDATE claro__open_badge_rule AS r 
            LEFT JOIN claro_resource_node AS n ON (r.node_id = n.id)
            SET r.subjectId = n.uuid, r.subjectClass = "Claroline\\CoreBundle\\Entity\\Resource\\ResourceNode" 
            WHERE r.node_id IS NOT NULL
              AND n.id IS NOT NULL
        ');

        // migrate sequence rules
        $this->addSql('
            UPDATE claro__open_badge_rule AS r 
            LEFT JOIN claro_resource_node AS n ON (r.node_id = n.id)
            LEFT JOIN innova_path AS p ON p.resourceNode_id = n.id
            SET r.subjectId = p.uuid, r.subjectClass = "Claroline\\EvaluationBundle\\Entity\\Sequence\\Sequence" 
            WHERE r.node_id IS NOT NULL
              AND n.id IS NOT NULL
              AND p.id IS NOT NULL 
        ');

        $this->addSql('
            UPDATE claro__open_badge_rule 
            SET action = "sequence_status" 
            WHERE subjectClass = "Claroline\\EvaluationBundle\\Entity\\Sequence\\Sequence" 
              AND action = "resource_status"
        ');

        $this->addSql('
            UPDATE claro__open_badge_rule 
            SET action = "sequence_progression" 
            WHERE subjectClass = "Claroline\\EvaluationBundle\\Entity\\Sequence\\Sequence" 
              AND action = "resource_progression"
        ');
        $this->addSql('
            UPDATE claro__open_badge_rule 
            SET action = "sequence_score" 
            WHERE subjectClass = "Claroline\\EvaluationBundle\\Entity\\Sequence\\Sequence" 
              AND action = "resource_score"
        ');
    }

    public function down(Schema $schema): void
    {
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
