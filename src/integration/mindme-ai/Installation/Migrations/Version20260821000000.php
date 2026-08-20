<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Drops orphaned claro_home_landing_widget table after migrating
 * homeBundle's LandingWidgetSerializer/Entity to mindme-ai.
 *
 * The homeBundle's LandingWidget was unused (superseded by mindme-ai's
 * own LandingWidget + DashboardWidgetSerializer). The serializer and
 * entity were deleted from homeBundle; the associated migration
 * (Version20260809005139) was also removed. This migration drops the
 * leftover table from the database.
 */
final class Version20260821000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Drops orphaned claro_home_landing_widget table (migrated to mindme-ai).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS claro_home_landing_widget');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE TABLE claro_home_landing_widget (
            id INT AUTO_INCREMENT NOT NULL,
            parameters JSON DEFAULT NULL,
            widgetInstance_id INT NOT NULL,
            INDEX IDX_36A44FA8AB7B5A55 (widgetInstance_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE claro_home_landing_widget ADD CONSTRAINT FK_36A44FA8AB7B5A55 FOREIGN KEY (widgetInstance_id) REFERENCES claro_widget_instance (id) ON DELETE CASCADE');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}