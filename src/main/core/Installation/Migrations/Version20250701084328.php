<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/07/01 08:43:30
 */
final class Version20250701084328 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_resource_rights 
            ADD creatableTypes JSON DEFAULT NULL
        ');

        $this->addSql('
            UPDATE claro_resource_rights AS r
            SET r.creatableTypes = CONCAT(\'["\', (
                SELECT GROUP_CONCAT(DISTINCT t.name SEPARATOR \'","\')
                FROM claro_resource_type AS t
                LEFT JOIN claro_list_type_creation AS l ON (l.resource_type_id = t.id)
                WHERE l.resource_rights_id = r.id
                GROUP BY l.resource_rights_id
            ), \'"]\')
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_resource_rights 
            DROP creatableTypes
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
