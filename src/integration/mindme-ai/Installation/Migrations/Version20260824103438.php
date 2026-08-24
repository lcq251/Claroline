<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Adds the unified product dimension (route B): resources & courses publish
 * into products. Replaces the resource-only ResourcePricing table as the
 * single source for recommendations & enablement.
 *
 * Structure:
 *   claro_mindme_ai_product
 *     id          INT PK AUTO_INCREMENT
 *     uuid        VARCHAR(36) UNIQUE NOT NULL
 *     target_type VARCHAR(20) NOT NULL      ('resource' | 'course')
 *     target_id   INT NOT NULL              (ResourceNode.id | Course.id)
 *     code        VARCHAR(64) UNIQUE NOT NULL
 *     price       DOUBLE PRECISION NULL
 *     description LONGTEXT NULL
 *     status      VARCHAR(20) NOT NULL      ('approved')
 *     creator_id  INT NULL                  (FK -> claro_user, ON DELETE SET NULL)
 *     created_at  DATETIME NOT NULL
 *     updated_at  DATETIME NOT NULL
 */
final class Version20260824103438 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adds unified product dimension (claro_mindme_ai_product).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE claro_mindme_ai_product (
                id INT AUTO_INCREMENT NOT NULL,
                uuid VARCHAR(36) NOT NULL,
                target_type VARCHAR(20) NOT NULL,
                target_id INT NOT NULL,
                code VARCHAR(64) NOT NULL,
                price DOUBLE PRECISION DEFAULT NULL,
                description LONGTEXT DEFAULT NULL,
                status VARCHAR(20) NOT NULL,
                creator_id INT DEFAULT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                UNIQUE INDEX UNIQ_PRODUCT_UUID (uuid),
                UNIQUE INDEX UNIQ_PRODUCT_CODE (code),
                INDEX idx_product_target (target_type, target_id),
                INDEX idx_product_status (status),
                INDEX IDX_PRODUCT_CREATOR (creator_id),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');

        $this->addSql('
            ALTER TABLE claro_mindme_ai_product
            ADD CONSTRAINT FK_PRODUCT_CREATOR FOREIGN KEY (creator_id)
            REFERENCES claro_user (id)
            ON DELETE SET NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_mindme_ai_product
            DROP FOREIGN KEY FK_PRODUCT_CREATOR
        ');

        $this->addSql('DROP TABLE claro_mindme_ai_product');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
