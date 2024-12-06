<?php

namespace Claroline\ForumBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/12/06 11:49:22
 */
final class Version20241206114917 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_forum_message 
            DROP FOREIGN KEY FK_6A49AC0EA76ED395
        ');
        $this->addSql('
            DROP INDEX IDX_6A49AC0EA76ED395 ON claro_forum_message
        ');
        $this->addSql('
            ALTER TABLE claro_forum_message 
            CHANGE created createdAt DATETIME DEFAULT NULL, 
            CHANGE updated updatedAt DATETIME DEFAULT NULL, 
            DROP author, 
            CHANGE user_id creator_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_forum_message 
            ADD CONSTRAINT FK_6A49AC0E61220EA6 FOREIGN KEY (creator_id) 
            REFERENCES claro_user (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_6A49AC0E61220EA6 ON claro_forum_message (creator_id)
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_forum_message 
            DROP FOREIGN KEY FK_6A49AC0E61220EA6
        ');
        $this->addSql('
            DROP INDEX IDX_6A49AC0E61220EA6 ON claro_forum_message
        ');
        $this->addSql('
            ALTER TABLE claro_forum_message 
            CHANGE createdAt created DATETIME NOT NULL, 
            CHANGE updatedAt updated DATETIME NOT NULL, 
            ADD author VARCHAR(255) DEFAULT NULL, 
            CHANGE creator_id user_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_forum_message 
            ADD CONSTRAINT FK_6A49AC0EA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) ON UPDATE NO ACTION 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_6A49AC0EA76ED395 ON claro_forum_message (user_id)
        ');
    }
}
