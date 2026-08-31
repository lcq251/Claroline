<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\DigitalBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Creates the DigitalTeacher AI resource table.
 */
final class Version20260831230000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the digital_teacher AI resource table.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE mindme_digital_teacher (
            id INT AUTO_INCREMENT NOT NULL,
            uuid VARCHAR(36) NOT NULL,
            resourceNode_id INT DEFAULT NULL,
            modelName VARCHAR(255) DEFAULT NULL,
            apiKey LONGTEXT DEFAULT NULL,
            expiresAt DATETIME DEFAULT NULL,
            usageLimit INT DEFAULT NULL,
            restrictionType VARCHAR(20) DEFAULT NULL,
            startAt DATETIME DEFAULT NULL,
            ttsEngine VARCHAR(50) DEFAULT NULL,
            voiceId VARCHAR(255) DEFAULT NULL,
            rate DOUBLE PRECISION DEFAULT NULL,
            pitch DOUBLE PRECISION DEFAULT NULL,
            avatarType VARCHAR(50) DEFAULT NULL,
            avatarAsset VARCHAR(255) DEFAULT NULL,
            ttsAppId VARCHAR(255) DEFAULT NULL,
            ttsToken LONGTEXT DEFAULT NULL,
            apiBaseUrl VARCHAR(255) DEFAULT NULL,
            UNIQUE INDEX UNIQ_DIGITAL_TEACHER_UUID (uuid),
            UNIQUE INDEX UNIQ_DIGITAL_TEACHER_NODE (resourceNode_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('ALTER TABLE mindme_digital_teacher ADD CONSTRAINT FK_DIGITAL_TEACHER_NODE FOREIGN KEY (resourceNode_id) REFERENCES claro_resource_node (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_digital_teacher DROP FOREIGN KEY FK_DIGITAL_TEACHER_NODE');
        $this->addSql('DROP TABLE IF EXISTS mindme_digital_teacher');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}