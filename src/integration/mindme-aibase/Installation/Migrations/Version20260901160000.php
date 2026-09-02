<?php

namespace Mindme\AibaseBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Adds a `kind` discriminator to the aibase resource.
 *
 * The single aibase resource can take two shapes, selected by `kind`:
 *   - `model`            (default): pure AI model — connection-test player.
 *   - `digital_teacher`:              full digital-teacher — multi-turn chat
 *                         + voice (TTS) + avatar.
 *
 * Existing rows keep `kind` NULL, which deserializes/serializes as 'model'
 * (backward compatible). No column is dropped.
 */
final class Version20260901160000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add kind discriminator column to aibase (model | digital_teacher).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD kind VARCHAR(30) DEFAULT NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN kind');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}