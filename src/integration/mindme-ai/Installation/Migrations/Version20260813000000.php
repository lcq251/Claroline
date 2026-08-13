<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Creates the resource input reference table (mindme-ai).
 *
 * Generic "resource as input of another resource" reference (route C):
 * both host_id and target_id reference claro_resource_node, so any resource
 * type can play either role. host delete cascades the reference rows,
 * target delete nulls the reference (dangling input).
 */
final class Version20260813000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Creates the resource input reference table (mindme-ai).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE claro_mindme_ai_resource_reference (
            id INT AUTO_INCREMENT NOT NULL,
            uuid VARCHAR(36) NOT NULL,
            host_id INT NOT NULL,
            target_id INT DEFAULT NULL,
            entity_order INT NOT NULL,
            UNIQUE INDEX uniq_ref_uuid (uuid),
            INDEX IDX_ref_host (host_id),
            INDEX IDX_ref_target (target_id),
            UNIQUE INDEX uniq_ref_host_target (host_id, target_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE claro_mindme_ai_resource_reference ADD CONSTRAINT FK_ref_host FOREIGN KEY (host_id) REFERENCES claro_resource_node (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE claro_mindme_ai_resource_reference ADD CONSTRAINT FK_ref_target FOREIGN KEY (target_id) REFERENCES claro_resource_node (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE claro_mindme_ai_resource_reference');
    }

    public function isTransactional(): bool
    {
        // MySQL does not support DDL queries in transactions
        return false;
    }
}
