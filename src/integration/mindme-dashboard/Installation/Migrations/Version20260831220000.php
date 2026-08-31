<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\DashboardBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Creates the desktop dashboard widget configuration table.
 */
final class Version20260831220000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the dashboard widget table.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE mindme_dashboard_widget (
            id INT AUTO_INCREMENT NOT NULL,
            parameters LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\',
            widgetInstance_id INT DEFAULT NULL,
            UNIQUE INDEX UNIQ_DASHBOARD_WIDGET_INST (widgetInstance_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('ALTER TABLE mindme_dashboard_widget ADD CONSTRAINT FK_DASHBOARD_WIDGET_INST FOREIGN KEY (widgetInstance_id) REFERENCES claro_widget_instance (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_dashboard_widget DROP FOREIGN KEY FK_DASHBOARD_WIDGET_INST');
        $this->addSql('DROP TABLE IF EXISTS mindme_dashboard_widget');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}