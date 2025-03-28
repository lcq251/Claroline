<?php

namespace Claroline\CursusBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/06 06:22:20
 */
final class Version20241106062216 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_cursusbundle_course 
            DROP FOREIGN KEY FK_3359D349727ACA70
        ');
        $this->addSql('
            DROP INDEX IDX_3359D349727ACA70 ON claro_cursusbundle_course
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_course 
            DROP max_users, 
            DROP parent_id, 
            CHANGE session_duration session_duration DOUBLE PRECISION DEFAULT 1 NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            ALTER TABLE claro_cursusbundle_course 
            ADD max_users INT DEFAULT NULL, 
            ADD parent_id INT DEFAULT NULL, 
            CHANGE session_duration session_duration DOUBLE PRECISION DEFAULT '1' NOT NULL
        ");
        $this->addSql('
            ALTER TABLE claro_cursusbundle_course 
            ADD CONSTRAINT FK_3359D349727ACA70 FOREIGN KEY (parent_id) 
            REFERENCES claro_cursusbundle_course (id) ON UPDATE NO ACTION 
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_3359D349727ACA70 ON claro_cursusbundle_course (parent_id)
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
