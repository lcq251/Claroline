<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2026/07/17 01:11:58
 */
final class Version20260717131158 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql("
            CREATE TABLE claro_mindme_ai_lesson (
                id INT AUTO_INCREMENT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                content JSON DEFAULT NULL, 
                generationParams JSON DEFAULT NULL, 
                rawMarkdown LONGTEXT DEFAULT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_162718ABD17F50A6 (uuid), 
                UNIQUE INDEX UNIQ_162718ABB87FAB32 (resourceNode_id), 
                PRIMARY KEY (id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ");
        $this->addSql("
            CREATE TABLE claro_mindme_dashboard_widget (
                id INT AUTO_INCREMENT NOT NULL, 
                widgetInstance_id INT NOT NULL, 
                INDEX IDX_7DE8C02CAB7B5A55 (widgetInstance_id), 
                PRIMARY KEY (id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_mindme_ai_lesson 
            ADD CONSTRAINT FK_162718ABB87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_mindme_dashboard_widget 
            ADD CONSTRAINT FK_7DE8C02CAB7B5A55 FOREIGN KEY (widgetInstance_id) 
            REFERENCES claro_widget_instance (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            ALTER TABLE claro_mindme_ai_lesson 
            DROP FOREIGN KEY FK_162718ABB87FAB32
        ");
        $this->addSql("
            ALTER TABLE claro_mindme_dashboard_widget 
            DROP FOREIGN KEY FK_7DE8C02CAB7B5A55
        ");
        $this->addSql("
            DROP TABLE claro_mindme_ai_lesson
        ");
        $this->addSql("
            DROP TABLE claro_mindme_dashboard_widget
        ");
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
