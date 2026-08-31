<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\MarkdownBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Creates the markdown resource and widget tables migrated from the
 * legacy mindme-ai plugin (claro_mindme_markdown / claro_mindme_markdown_widget).
 */
final class Version20260831170000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create mindme markdown resource (mindme_markdown) and widget (mindme_markdown_widget) tables.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE mindme_markdown (
            id INT AUTO_INCREMENT NOT NULL,
            uuid VARCHAR(36) NOT NULL,
            content LONGTEXT DEFAULT NULL,
            resourceNode_id INT DEFAULT NULL,
            UNIQUE INDEX UNIQ_MD_UUID (uuid),
            UNIQUE INDEX UNIQ_MD_RESOURCE_NODE (resourceNode_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('CREATE TABLE mindme_markdown_widget (
            id INT AUTO_INCREMENT NOT NULL,
            content LONGTEXT DEFAULT NULL,
            widgetInstance_id INT NOT NULL,
            INDEX IDX_MINDME_MDWidget_AB7B5A55 (widgetInstance_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('ALTER TABLE mindme_markdown ADD CONSTRAINT FK_md_resource_node FOREIGN KEY (resourceNode_id) REFERENCES claro_resource_node (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE mindme_markdown_widget ADD CONSTRAINT FK_MINDME_MDWidget_AB7B5A55 FOREIGN KEY (widgetInstance_id) REFERENCES claro_widget_instance (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_markdown_widget DROP FOREIGN KEY FK_MINDME_MDWidget_AB7B5A55');
        $this->addSql('ALTER TABLE mindme_markdown DROP FOREIGN KEY FK_md_resource_node');
        $this->addSql('DROP TABLE IF EXISTS mindme_markdown_widget');
        $this->addSql('DROP TABLE IF EXISTS mindme_markdown');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}