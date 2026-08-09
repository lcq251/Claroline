<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2026/08/10 07:40:00
 */
final class Version20260810074000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql("
            CREATE TABLE claro_mindme_landing_widget (
                id INT AUTO_INCREMENT NOT NULL, 
                parameters JSON DEFAULT NULL, 
                widgetInstance_id INT NOT NULL, 
                INDEX IDX_BCB0F532AB7B5A55 (widgetInstance_id), 
                PRIMARY KEY (id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_mindme_landing_widget 
            ADD CONSTRAINT FK_BCB0F532AB7B5A55 FOREIGN KEY (widgetInstance_id) 
            REFERENCES claro_widget_instance (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            ALTER TABLE claro_mindme_landing_widget 
            DROP FOREIGN KEY FK_BCB0F532AB7B5A55
        ");
        $this->addSql("
            DROP TABLE claro_mindme_landing_widget
        ");
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
