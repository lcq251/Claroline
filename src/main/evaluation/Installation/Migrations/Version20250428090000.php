<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250428090000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // open the progression tool for all users with access to one sequence
        $this->addSql('
           INSERT INTO claro_tool_rights (mask, role_id, ordered_tool_id)
           SELECT 1 as mask, rr.role_id AS role_id, ot.id AS ordered_tool_id
           FROM claro_resource_rights AS rr
           LEFT JOIN claro_resource_node AS n ON rr.resourceNode_id = n.id
           LEFT JOIN claro_workspace AS w ON n.workspace_id = w.id
           LEFT JOIN claro_ordered_tool AS ot ON w.uuid = ot.context_id
           LEFT JOIN innova_path AS p ON n.id = p.resourceNode_id
           LEFT JOIN claro_role AS r ON rr.role_id = r.id
           WHERE n.id IS NOT NULL
             AND n.mime_type = "custom/innova_path"
             AND n.active = 1
             AND w.id IS NOT NULL
             AND r.id IS NOT NULL
             AND rr.mask & 1 = 1
             AND ot.tool_name = "progression"
             AND ot.context_name = "workspace"
             AND NOT EXISTS (SELECT a.id FROM claro_tool_rights AS a WHERE a.role_id = r.id AND a.ordered_tool_id = ot.id)
           GROUP BY role_id, ordered_tool_id
        ');

        // create sequence assignments for all users with access to the original path resource
        $this->addSql('
           INSERT INTO claro_evaluation_sequence_assignment (uuid, sequence_id, role_id, required, scored)
           SELECT UUID() as uuid, p.id AS sequence_id, rr.role_id AS role_id, n.required AS required, n.evaluated AS scored
           FROM innova_path AS p
           LEFT JOIN claro_resource_node AS n ON n.id = p.resourceNode_id
           LEFT JOIN claro_resource_rights AS rr ON rr.resourceNode_id = n.id
           LEFT JOIN claro_role AS r ON rr.role_id = r.id
           WHERE n.id IS NOT NULL
             AND n.active = 1
             AND r.id IS NOT NULL
             AND rr.mask & 1 = 1
             AND r.name != "ROLE_ANONYMOUS"
             AND NOT EXISTS (SELECT a.id FROM claro_evaluation_sequence_assignment AS a WHERE a.role_id = r.id)
        ');

        // make sequence with anonymous access public
        $this->addSql('
           UPDATE innova_path AS p 
           LEFT JOIN claro_resource_node AS n ON n.id = p.resourceNode_id
           LEFT JOIN claro_resource_rights AS rr ON rr.resourceNode_id = n.id
           LEFT JOIN claro_role AS r ON rr.role_id = r.id
           SET p.is_public = 1
           WHERE n.id IS NOT NULL
             AND n.active = 1
             AND r.id IS NOT NULL
             AND rr.mask & 1 = 1
             AND r.name = "ROLE_ANONYMOUS"
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
