<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\MdhomeBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Creates the mindme-mdhome landing widget table.
 *
 * The landing widgets (landing-hero / landing-features / landing-packaging)
 * persist their full JSON configuration here. Table name follows the bundle
 * namespace convention (mindme_mdhome_*); it is the mdhome counterpart of the
 * former mindme-ai claro_mindme_landing_widget table.
 */
final class Version20260831145209 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create table mindme_mdhome_landing_widget for landing widget JSON configuration.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE mindme_mdhome_landing_widget (
            id INT AUTO_INCREMENT NOT NULL,
            parameters JSON DEFAULT NULL,
            widgetInstance_id INT NOT NULL,
            INDEX IDX_MDHLW_AB7B5A55 (widgetInstance_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('ALTER TABLE mindme_mdhome_landing_widget ADD CONSTRAINT FK_MDHLW_AB7B5A55 FOREIGN KEY (widgetInstance_id) REFERENCES claro_widget_instance (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_mdhome_landing_widget DROP FOREIGN KEY FK_MDHLW_AB7B5A55');
        $this->addSql('DROP TABLE IF EXISTS mindme_mdhome_landing_widget');
    }

    public function isTransactional(): bool
    {
        // MySQL does not support DDL queries in transactions
        return false;
    }
}