<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * C-24: AiLesson refactored from "AI generated lesson content" to
 * "AI model resource (license style)".
 *
 * Drops the legacy course-content columns (content / generationParams /
 * rawMarkdown — no real data, confirmed) and adds the model-resource
 * columns (model_name / api_key / expires_at / is_default).
 */
final class Version20260811000000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE claro_mindme_ai_lesson DROP content, DROP generationParams, DROP rawMarkdown');
        $this->addSql('ALTER TABLE claro_mindme_ai_lesson ADD model_name VARCHAR(255) DEFAULT NULL, ADD api_key LONGTEXT DEFAULT NULL, ADD expires_at DATETIME DEFAULT NULL, ADD is_default TINYINT(1) DEFAULT 0 NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE claro_mindme_ai_lesson DROP is_default, DROP expires_at, DROP api_key, DROP model_name');
        $this->addSql('ALTER TABLE claro_mindme_ai_lesson ADD content JSON DEFAULT NULL, ADD generationParams JSON DEFAULT NULL, ADD rawMarkdown LONGTEXT DEFAULT NULL');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        return false;
    }
}
