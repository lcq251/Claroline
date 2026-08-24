<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Drops orphaned claro_mindme_ai_resource_pricing table after the
 * resource-only pricing dimension was superseded by the unified Product
 * entity (claro_mindme_ai_product, route B).
 *
 * The ResourcePricing entity, ResourcePricingSerializer, the services.yml
 * registration, and the ResourceNode::$pricing association were all removed;
 * pricing now lives solely on Product (targetType/targetId covers both
 * 'resource' and 'course'). This migration drops the leftover table.
 *
 * The original table-creating migration (Version20260821000001) is kept in
 * the history because it was already executed against the database.
 */
final class Version20260824161113 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Drops orphaned claro_mindme_ai_resource_pricing table (superseded by Product).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS claro_mindme_ai_resource_pricing');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE claro_mindme_ai_resource_pricing (
                id INT AUTO_INCREMENT NOT NULL,
                uuid VARCHAR(36) NOT NULL,
                resource_node_id INT DEFAULT NULL,
                price DOUBLE PRECISION DEFAULT NULL,
                currency VARCHAR(3) DEFAULT \'CNY\' NOT NULL,
                description LONGTEXT DEFAULT NULL,
                UNIQUE INDEX UNIQ_1F0C4D4AD17F50A6 (uuid),
                UNIQUE INDEX UNIQ_1F0C4D4AB87FAB32 (resource_node_id),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_mindme_ai_resource_pricing
            ADD CONSTRAINT FK_1F0C4D4AB87FAB32 FOREIGN KEY (resource_node_id)
            REFERENCES claro_resource_node (id)
            ON DELETE CASCADE
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
