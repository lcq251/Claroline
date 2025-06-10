<?php

namespace Claroline\ForumBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/06/10 08:34:18
 */
final class Version20250610083417 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_forum_subject 
            DROP FOREIGN KEY FK_273AA20BA76ED395
        ');
        $this->addSql('
            DROP INDEX IDX_273AA20BA76ED395 ON claro_forum_subject
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject 
            CHANGE created createdAt DATETIME DEFAULT NULL, 
            CHANGE updated updatedAt DATETIME DEFAULT NULL,  
            CHANGE user_id creator_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject 
            ADD CONSTRAINT FK_273AA20B61220EA6 FOREIGN KEY (creator_id) 
            REFERENCES claro_user (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_273AA20B61220EA6 ON claro_forum_subject (creator_id)
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_forum_subject 
            DROP FOREIGN KEY FK_273AA20B61220EA6
        ');
        $this->addSql('
            DROP INDEX IDX_273AA20B61220EA6 ON claro_forum_subject
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject 
            CHANGE createdAt created DATETIME NOT NULL, 
            CHANGE updatedAt updated DATETIME NOT NULL, 
            CHANGE creator_id user_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject 
            ADD CONSTRAINT FK_273AA20BA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) ON UPDATE NO ACTION 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_273AA20BA76ED395 ON claro_forum_subject (user_id)
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
