<?php

namespace Claroline\ForumBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/12/06 10:20:34
 */
final class Version20241206102033 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_resource_node AS n
            LEFT JOIN claro_forum AS f ON (f.resourceNode_id = n.id)
            SET n.description_html = f.description
            WHERE f.id IS NOT NULL
              AND f.description IS NOT NULL
              AND f.description != ""
        ');

        $this->addSql('
            ALTER TABLE claro_forum 
            DROP validationMode, 
            DROP displayMessages, 
            DROP dataListOptions, 
            DROP lockDate, 
            DROP show_overview, 
            DROP description, 
            DROP messageOrder, 
            DROP expandComments
        ');
        $this->addSql('
            DELETE FROM claro_forum_message WHERE moderation IS NOT NULL AND moderation != "NONE" AND first = 0
        ');
        $this->addSql('
            ALTER TABLE claro_forum_message 
            DROP moderation
        ');

        $this->addSql('
            DELETE FROM claro_forum_subject WHERE moderation IS NOT NULL AND moderation != "NONE" 
        ');

        $this->addSql('
            ALTER TABLE claro_forum_subject 
            DROP moderation
        ');

        $this->addSql('
            DELETE FROM claro_forum_user WHERE notified = false 
        ');
        $this->addSql('
            ALTER TABLE claro_forum_user 
            DROP access, 
            DROP banned
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            ALTER TABLE claro_forum 
            ADD validationMode VARCHAR(255) NOT NULL, 
            ADD displayMessages INT NOT NULL, 
            ADD dataListOptions VARCHAR(255) NOT NULL, 
            ADD lockDate DATETIME DEFAULT NULL, 
            ADD show_overview TINYINT(1) NOT NULL, 
            ADD description LONGTEXT DEFAULT NULL, 
            ADD messageOrder VARCHAR(255) DEFAULT 'ASC' NOT NULL, 
            ADD expandComments TINYINT(1) DEFAULT 0 NOT NULL
        ");
        $this->addSql('
            ALTER TABLE claro_forum_message 
            ADD moderation VARCHAR(255) NOT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject 
            ADD moderation VARCHAR(255) NOT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_forum_user 
            ADD access TINYINT(1) NOT NULL, 
            ADD banned TINYINT(1) NOT NULL
        ');
    }
}
