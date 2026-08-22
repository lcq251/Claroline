<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260816000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Creates the mindme_markdown resource table and registers the resource type.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE claro_mindme_markdown (
            id INT AUTO_INCREMENT NOT NULL,
            uuid VARCHAR(36) NOT NULL,
            content LONGTEXT DEFAULT NULL,
            resourceNode_id INT DEFAULT NULL,
            UNIQUE INDEX UNIQ_MD_UUID (uuid),
            UNIQUE INDEX UNIQ_MD_RESOURCE_NODE (resourceNode_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE claro_mindme_markdown ADD CONSTRAINT FK_md_resource_node FOREIGN KEY (resourceNode_id) REFERENCES claro_resource_node (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE claro_mindme_markdown');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}