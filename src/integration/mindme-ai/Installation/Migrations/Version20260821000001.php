<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Adds pricing dimension to ResourceNode via new independent structure.
 * 
 * Creates claro_mindme_ai_resource_pricing table that links to
 * claro_resource_node with a one-to-one relationship (onDelete CASCADE).
 * 
 * Structure:
 *   claro_mindme_ai_resource_pricing
 *     id INT PK AUTO_INCREMENT
 *     uuid VARCHAR(36) UNIQUE NOT NULL
 *     resource_node_id INT NULL UNIQUE (FK -> claro_resource_node.id, ON DELETE CASCADE)
 *     price DOUBLE PRECISION NULL
 *     currency VARCHAR(3) DEFAULT 'CNY' NOT NULL
 *     description LONGTEXT NULL
 * 
 * Semantics: pricing.price and pricing.description reference the new entity's
 * same-named properties.
 */
final class Version20260821000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adds pricing dimension to ResourceNode via new independent table.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("
            CREATE TABLE claro_mindme_ai_resource_pricing (
                id INT AUTO_INCREMENT NOT NULL,
                uuid VARCHAR(36) NOT NULL,
                resource_node_id INT DEFAULT NULL,
                price DOUBLE PRECISION DEFAULT NULL,
                currency VARCHAR(3) DEFAULT 'CNY' NOT NULL,
                description LONGTEXT DEFAULT NULL,
                UNIQUE INDEX UNIQ_1F0C4D4AD17F50A6 (uuid),
                UNIQUE INDEX UNIQ_1F0C4D4AB87FAB32 (resource_node_id),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ");

        $this->addSql("
            ALTER TABLE claro_mindme_ai_resource_pricing
            ADD CONSTRAINT FK_1F0C4D4AB87FAB32 FOREIGN KEY (resource_node_id)
            REFERENCES claro_resource_node (id)
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            ALTER TABLE claro_mindme_ai_resource_pricing
            DROP FOREIGN KEY FK_1F0C4D4AB87FAB32
        ");

        $this->addSql("
            DROP TABLE claro_mindme_ai_resource_pricing
        ");
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
