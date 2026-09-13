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
 * Split the digital teacher out of the Aibase resource:
 *   - creates mindme_aiteacher (ai-avatar-bot configuration carrier),
 *   - drops the 10 digital-teacher columns (kind + TTS/avatar) from
 *     mindme_aibase_lesson, leaving it a pure AI-model resource.
 */
final class Version20260912110000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Split digital teacher into Aiteacher; drop kind/TTS/avatar from Aibase.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE mindme_aiteacher (
            id INT AUTO_INCREMENT NOT NULL,
            uuid VARCHAR(36) NOT NULL,
            resourceNode_id INT DEFAULT NULL,
            widgetBaseUrl VARCHAR(255) DEFAULT NULL,
            brainAibaseId INT DEFAULT NULL,
            modelUrl VARCHAR(255) DEFAULT NULL,
            voice VARCHAR(64) DEFAULT NULL,
            mode VARCHAR(16) DEFAULT NULL,
            usageLimit INT DEFAULT NULL,
            UNIQUE INDEX UNIQ_AITEACHER_UUID (uuid),
            UNIQUE INDEX UNIQ_AITEACHER_NODE (resourceNode_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('ALTER TABLE mindme_aiteacher ADD CONSTRAINT FK_AITEACHER_NODE FOREIGN KEY (resourceNode_id) REFERENCES claro_resource_node (id) ON DELETE CASCADE');

        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN kind');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN ttsEngine');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN voiceId');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN rate');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN pitch');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN avatarType');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN avatarAsset');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN ttsAppId');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN ttsToken');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD kind VARCHAR(30) DEFAULT NULL');
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD ttsEngine VARCHAR(30) DEFAULT NULL');
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD voiceId VARCHAR(100) DEFAULT NULL');
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD rate DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD pitch DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD avatarType VARCHAR(30) DEFAULT NULL');
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD avatarAsset VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD ttsAppId VARCHAR(100) DEFAULT NULL');
        $this->addSql('ALTER TABLE mindme_aibase_lesson ADD ttsToken LONGTEXT DEFAULT NULL');

        $this->addSql('ALTER TABLE mindme_aiteacher DROP FOREIGN KEY FK_AITEACHER_NODE');
        $this->addSql('DROP TABLE IF EXISTS mindme_aiteacher');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
