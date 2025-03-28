<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/10/14 04:48:03
 */
final class Version20241014164803 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro__organization 
            ADD phone VARCHAR(255) DEFAULT NULL, 
            ADD address_street1 VARCHAR(255) DEFAULT NULL, 
            ADD address_street2 VARCHAR(255) DEFAULT NULL, 
            ADD address_postal_code VARCHAR(255) DEFAULT NULL, 
            ADD address_city VARCHAR(255) DEFAULT NULL, 
            ADD address_state VARCHAR(255) DEFAULT NULL, 
            ADD address_country VARCHAR(255) DEFAULT NULL
        ');
        $this->addSql('
            CREATE UNIQUE INDEX context_unique_tool ON claro_ordered_tool (
                tool_name, context_name, context_id
            )
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro__organization 
            DROP phone, 
            DROP address_street1, 
            DROP address_street2, 
            DROP address_postal_code, 
            DROP address_city, 
            DROP address_state, 
            DROP address_country
        ');
        $this->addSql('
            DROP INDEX context_unique_tool ON claro_ordered_tool
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
