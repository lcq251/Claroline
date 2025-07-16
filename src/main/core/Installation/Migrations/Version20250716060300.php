<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/07/16 06:03:01
 */
final class Version20250716060300 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_workspace SET poster = thumbnail WHERE thumbnail IS NOT NULL AND thumbnail != "" AND poster IS NULL
        ');
        $this->addSql('
            UPDATE claro_user SET poster = thumbnail WHERE thumbnail IS NOT NULL AND thumbnail != ""
        ');
        $this->addSql('
            ALTER TABLE claro_user 
            DROP thumbnail
        ');

        $this->addSql('
            UPDATE claro__location SET poster = thumbnail WHERE thumbnail IS NOT NULL AND thumbnail != ""
        ');
        $this->addSql('
            ALTER TABLE claro__location 
            DROP thumbnail
        ');

        $this->addSql('
            UPDATE claro_planned_object SET poster = thumbnail WHERE thumbnail IS NOT NULL AND thumbnail != ""
        ');
        $this->addSql('
            ALTER TABLE claro_planned_object 
            DROP thumbnail
        ');

        $this->addSql('
            UPDATE claro_resource_node SET poster = thumbnail WHERE thumbnail IS NOT NULL AND thumbnail != ""
        ');
        $this->addSql('
            ALTER TABLE claro_resource_node 
            DROP thumbnail
        ');

        $this->addSql('
            UPDATE claro_ordered_tool SET poster = thumbnail WHERE thumbnail IS NOT NULL AND thumbnail != ""
        ');
        $this->addSql('
            ALTER TABLE claro_ordered_tool 
            DROP thumbnail
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro__location 
            ADD thumbnail VARCHAR(255) DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_ordered_tool 
            ADD thumbnail VARCHAR(255) DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_planned_object 
            ADD thumbnail VARCHAR(255) DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_resource_node 
            ADD thumbnail VARCHAR(255) DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_user 
            ADD thumbnail VARCHAR(255) DEFAULT NULL
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
