<?php

namespace Claroline\MindMeAiBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * C-25 (v2, 2026-08-11 用户口径调整): 试用次数限制按「登录用户 × AiLesson 资源 × 日期」。
 *
 * - claro_mindme_ai_lesson 加 usageLimit（int 可空）：每个 AI 资源（模型）的试用限额，
 *   管理员在资源配置里设置；null 表示走平台兜底 mindme_ai.daily_limit。
 * - 新建 claro_mindme_ai_usage 独立计数表：aiLessonId 关联被试用资源（冗余存 usageLimit
 *   快照——改资源限额不影响历史），UNIQUE(userId, aiLessonId, periodDate) 惰性重置
 *   （日期变化即新行，无需 cron）。
 *
 * Scalar columns follow the entity mapping (property names, camelCase) —
 * same convention as the C-24 migration.
 */
final class Version20260811000001 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE claro_mindme_ai_lesson ADD usageLimit INT DEFAULT NULL');
        $this->addSql("
            CREATE TABLE claro_mindme_ai_usage (
                id INT AUTO_INCREMENT NOT NULL,
                userId INT NOT NULL,
                aiLessonId INT NOT NULL,
                periodDate DATE NOT NULL,
                usageCount INT NOT NULL DEFAULT 0,
                usageLimit INT NOT NULL,
                UNIQUE INDEX uniq_user_lesson_date (userId, aiLessonId, periodDate),
                PRIMARY KEY (id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE claro_mindme_ai_usage');
        $this->addSql('ALTER TABLE claro_mindme_ai_lesson DROP usageLimit');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        return false;
    }
}
