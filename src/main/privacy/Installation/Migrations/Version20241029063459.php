<?php

namespace Claroline\PrivacyBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/10/29 06:35:03
 */
final class Version20241029063459 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_privacy_parameters 
            DROP FOREIGN KEY FK_5F8AD24D5DA0FB8
        ');
        $this->addSql('
            DROP INDEX IDX_5F8AD24D5DA0FB8 ON claro_privacy_parameters
        ');
        $this->addSql('
            ALTER TABLE claro_privacy_parameters 
            ADD privacy_template_id INT DEFAULT NULL, 
            CHANGE template_id tos_template_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_privacy_parameters 
            ADD CONSTRAINT FK_5F8AD24DA636EC94 FOREIGN KEY (tos_template_id) 
            REFERENCES claro_template (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            ALTER TABLE claro_privacy_parameters 
            ADD CONSTRAINT FK_5F8AD24DE674A700 FOREIGN KEY (privacy_template_id) 
            REFERENCES claro_template (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_5F8AD24DA636EC94 ON claro_privacy_parameters (tos_template_id)
        ');
        $this->addSql('
            CREATE INDEX IDX_5F8AD24DE674A700 ON claro_privacy_parameters (privacy_template_id)
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_privacy_parameters 
            DROP FOREIGN KEY FK_5F8AD24DA636EC94
        ');
        $this->addSql('
            ALTER TABLE claro_privacy_parameters 
            DROP FOREIGN KEY FK_5F8AD24DE674A700
        ');
        $this->addSql('
            DROP INDEX IDX_5F8AD24DA636EC94 ON claro_privacy_parameters
        ');
        $this->addSql('
            DROP INDEX IDX_5F8AD24DE674A700 ON claro_privacy_parameters
        ');
        $this->addSql('
            ALTER TABLE claro_privacy_parameters 
            ADD template_id INT DEFAULT NULL, 
            DROP tos_template_id, 
            DROP privacy_template_id
        ');
        $this->addSql('
            ALTER TABLE claro_privacy_parameters 
            ADD CONSTRAINT FK_5F8AD24D5DA0FB8 FOREIGN KEY (template_id) 
            REFERENCES claro_template (id) ON UPDATE NO ACTION 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_5F8AD24D5DA0FB8 ON claro_privacy_parameters (template_id)
        ');
    }
}
