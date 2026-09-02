<?php

namespace Mindme\AibaseBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Extends the aibase resource with digital-teacher capabilities.
 *
 * Adds the TTS (voice) and avatar columns so a single aibase resource can
 * act as a "digital teacher": text chat + optional speech synthesis +
 * optional visual avatar. Connection/model configuration is unchanged
 * (platformType + baseUrl + modelName are already present).
 *
 * TTS is backend-optional — the player degrades to Web Speech API (browser)
 * when no engine is configured, so no Python / external CLI is required on
 * the host (edge engine is opt-in and needs `pip install edge-tts`).
 */
final class Version20260901150000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add TTS + avatar columns to aibase for digital-teacher mode.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD ttsEngine VARCHAR(30) DEFAULT NULL");
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD voiceId VARCHAR(100) DEFAULT NULL");
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD rate DOUBLE PRECISION DEFAULT NULL");
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD pitch DOUBLE PRECISION DEFAULT NULL");
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD avatarType VARCHAR(30) DEFAULT NULL");
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD avatarAsset VARCHAR(255) DEFAULT NULL");
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD ttsAppId VARCHAR(100) DEFAULT NULL");
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD ttsToken LONGTEXT DEFAULT NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN ttsToken');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN ttsAppId');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN avatarAsset');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN avatarType');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN pitch');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN rate');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN voiceId');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN ttsEngine');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}