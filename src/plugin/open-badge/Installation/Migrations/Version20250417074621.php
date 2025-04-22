<?php

namespace Claroline\OpenBadgeBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/04/17 07:46:22
 */
final class Version20250417074621 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro__open_badge_badge_class CHANGE image image VARCHAR(255) DEFAULT NULL
        ');

        $this->addSql('
            ALTER TABLE claro__open_badge_rule 
            ADD subjectClass VARCHAR(255) DEFAULT NULL, 
            ADD subjectId VARCHAR(255) DEFAULT NULL,
            CHANGE data data JSON DEFAULT NULL
        ');

        $this->addSql('
            UPDATE claro__open_badge_rule SET action = "resource_progression" WHERE action = "resource_completed_above"
        ');
        $this->addSql('
            UPDATE claro__open_badge_rule SET action = "resource_score" WHERE action = "resource_score_above"
        ');
        $this->addSql('
            UPDATE claro__open_badge_rule SET action = "workspace_progression" WHERE action = "workspace_completed_above"
        ');
        $this->addSql('
            UPDATE claro__open_badge_rule SET action = "workspace_score" WHERE action = "workspace_score_above"
        ');

        $this->addSql('
            UPDATE claro__open_badge_rule AS r 
            LEFT JOIN claro_workspace AS w ON (r.workspace_id = w.id)
            SET r.subjectId = w.uuid, r.subjectClass = "Claroline\\CoreBundle\\Entity\\Workspace\\Workspace" 
            WHERE r.workspace_id IS NOT NULL
              AND w.id IS NOT NULL
        ');
        $this->addSql('
            UPDATE claro__open_badge_rule AS br 
            LEFT JOIN claro_role AS r ON (br.role_id = r.id)
            SET br.subjectId = r.uuid, br.subjectClass="Claroline\\CoreBundle\\Entity\\Role" 
            WHERE br.role_id IS NOT NULL
              AND r.id IS NOT NULL
        ');
        $this->addSql('
            UPDATE claro__open_badge_rule AS r 
            LEFT JOIN claro_group AS g ON (r.group_id = g.id)
            SET r.subjectId = g.uuid, r.subjectClass="Claroline\\CoreBundle\\Entity\\Group" 
            WHERE r.group_id IS NOT NULL
              AND g.id IS NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro__open_badge_badge_class CHANGE image image VARCHAR(255) NOT NULL
        ');

        $this->addSql('
            ALTER TABLE claro__open_badge_rule 
            DROP subjectClass, 
            DROP subjectId,
            CHANGE data data JSON NOT NULL
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
