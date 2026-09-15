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
 * Creates the per-user digital-teacher avatar configuration table
 * (mindme_user_avatar): each signed-in user may personalise their Live2D
 * model / voice / mode. Empty fields fall back to the Aiteacher defaults.
 */
final class Version20260914000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the per-user digital-teacher avatar table.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE mindme_user_avatar (
            id INT AUTO_INCREMENT NOT NULL,
            user_id INT NOT NULL,
            modelUrl VARCHAR(255) DEFAULT NULL,
            voice VARCHAR(64) DEFAULT NULL,
            mode VARCHAR(16) DEFAULT NULL,
            UNIQUE INDEX UNIQ_USER_AVATAR_USER (user_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('ALTER TABLE mindme_user_avatar ADD CONSTRAINT FK_USER_AVATAR_USER FOREIGN KEY (user_id) REFERENCES claro_user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_user_avatar DROP FOREIGN KEY FK_USER_AVATAR_USER');
        $this->addSql('DROP TABLE IF EXISTS mindme_user_avatar');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
