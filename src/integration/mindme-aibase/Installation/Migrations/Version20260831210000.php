<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Creates the aibase resource (mindme_aibase_lesson), its lifetime usage
 * counter (mindme_aibase_usage) and the generic resource-reference table
 * (mindme_aibase_resource_reference), migrated from the legacy mindme-ai
 * plugin (ai-lesson resource), renamed to `aibase`.
 */
final class Version20260831210000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the aibase (AI model resource) tables.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE mindme_aibase_lesson (
            id INT AUTO_INCREMENT NOT NULL,
            uuid VARCHAR(36) NOT NULL,
            resourceNode_id INT DEFAULT NULL,
            modelName VARCHAR(255) DEFAULT NULL,
            apiKey LONGTEXT DEFAULT NULL,
            expiresAt DATETIME DEFAULT NULL,
            isDefault TINYINT(1) DEFAULT 0 NOT NULL,
            usageLimit INT DEFAULT NULL,
            restrictionType VARCHAR(20) DEFAULT NULL,
            startAt DATETIME DEFAULT NULL,
            UNIQUE INDEX UNIQ_162718ABD17F50A6 (uuid),
            UNIQUE INDEX UNIQ_162718ABB87FAB32 (resourceNode_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('CREATE TABLE mindme_aibase_usage (
            id INT AUTO_INCREMENT NOT NULL,
            userId INT NOT NULL,
            aibaseId INT NOT NULL,
            usageCount INT NOT NULL DEFAULT 0,
            usageLimit INT NOT NULL,
            UNIQUE INDEX uniq_user_lesson (userId, aibaseId),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('CREATE TABLE mindme_aibase_resource_reference (
            id INT AUTO_INCREMENT NOT NULL,
            uuid VARCHAR(36) NOT NULL,
            host_id INT NOT NULL,
            target_id INT DEFAULT NULL,
            entity_order INT NOT NULL,
            userId INT DEFAULT NULL,
            UNIQUE INDEX uniq_ref_uuid (uuid),
            INDEX IDX_ref_host (host_id),
            INDEX IDX_ref_target (target_id),
            INDEX idx_ref_user (userId),
            UNIQUE INDEX uniq_ref_host_user_target (host_id, userId, target_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Foreign keys
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD CONSTRAINT FK_162718ABB87FAB32 FOREIGN KEY (resourceNode_id) REFERENCES claro_resource_node (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE mindme_aibase_resource_reference ADD CONSTRAINT FK_ref_host FOREIGN KEY (host_id) REFERENCES claro_resource_node (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE mindme_aibase_resource_reference ADD CONSTRAINT FK_ref_target FOREIGN KEY (target_id) REFERENCES claro_resource_node (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_aibase_resource_reference DROP FOREIGN KEY FK_ref_target');
        $this->addSql('ALTER TABLE mindme_aibase_resource_reference DROP FOREIGN KEY FK_ref_host');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP FOREIGN KEY FK_162718ABB87FAB32');
        $this->addSql('DROP TABLE IF EXISTS mindme_aibase_resource_reference');
        $this->addSql('DROP TABLE IF EXISTS mindme_aibase_usage');
        $this->addSql('DROP TABLE IF EXISTS mindme_aibase_lesson');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}