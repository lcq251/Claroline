<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\BillingBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Creates the product table for selling resources & courses, migrated from the
 * legacy mindme-ai plugin (mindme_billing_product).
 */
final class Version20260831200000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the product table (mindme_billing_product).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE mindme_billing_product (
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
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('ALTER TABLE mindme_billing_product ADD CONSTRAINT FK_PRODUCT_CREATOR FOREIGN KEY (creator_id) REFERENCES claro_user (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_billing_product DROP FOREIGN KEY FK_PRODUCT_CREATOR');
        $this->addSql('DROP TABLE IF EXISTS mindme_billing_product');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}