<?php

namespace UJM\ExoBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/10/17 05:27:13
 */
final class Version20241017052711 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE ujm_response CHANGE used_hints used_hints LONGTEXT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE ujm_exercise CHANGE date_correction date_correction VARCHAR(255) DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE ujm_question 
            DROP FOREIGN KEY FK_2F606977A76ED395
        ');
        $this->addSql('
            DROP INDEX IDX_2F606977A76ED395 ON ujm_question
        ');
        $this->addSql('
            ALTER TABLE ujm_question CHANGE user_id creator_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE ujm_question 
            ADD CONSTRAINT FK_2F60697761220EA6 FOREIGN KEY (creator_id) 
            REFERENCES claro_user (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_2F60697761220EA6 ON ujm_question (creator_id)
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE ujm_exercise CHANGE date_correction date_correction DATETIME DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE ujm_question 
            DROP FOREIGN KEY FK_2F60697761220EA6
        ');
        $this->addSql('
            DROP INDEX IDX_2F60697761220EA6 ON ujm_question
        ');
        $this->addSql('
            ALTER TABLE ujm_question CHANGE creator_id user_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE ujm_question 
            ADD CONSTRAINT FK_2F606977A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) ON UPDATE NO ACTION 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_2F606977A76ED395 ON ujm_question (user_id)
        ');
        $this->addSql("
            ALTER TABLE ujm_response CHANGE used_hints used_hints LONGTEXT DEFAULT NULL COMMENT '(DC2Type:simple_array)'
        ");
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
