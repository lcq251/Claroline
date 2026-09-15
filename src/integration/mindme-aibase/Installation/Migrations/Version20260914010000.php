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
 * Creates the per-user digital-teacher knowledge base table
 * (mindme_user_knowledge). Entries are stored as a single JSON document
 * reusing the ai-avatar-bot {q, a, kw, source} entry format.
 */
final class Version20260914010000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the per-user digital-teacher knowledge table.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE mindme_user_knowledge (
            id INT AUTO_INCREMENT NOT NULL,
            user_id INT NOT NULL,
            entries JSON DEFAULT NULL COMMENT \'(DC2Type:json)\',
            updatedAt DATETIME DEFAULT NULL,
            UNIQUE INDEX UNIQ_USER_KNOWLEDGE_USER (user_id),
            PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('ALTER TABLE mindme_user_knowledge ADD CONSTRAINT FK_USER_KNOWLEDGE_USER FOREIGN KEY (user_id) REFERENCES claro_user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_user_knowledge DROP FOREIGN KEY FK_USER_KNOWLEDGE_USER');
        $this->addSql('DROP TABLE IF EXISTS mindme_user_knowledge');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
