<?php

namespace Claroline\TemplateBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/11 07:44:54
 */
final class Version20241111074450 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_template 
            DROP FOREIGN KEY FK_DFB26A757428AC44
        ');
        $this->addSql('
            DROP INDEX IDX_DFB26A757428AC44 ON claro_template
        ');
        $this->addSql('
            ALTER TABLE claro_template 
            ADD entity_type VARCHAR(255) NOT NULL, 
            ADD is_default TINYINT(1) NOT NULL, 
            ADD description LONGTEXT DEFAULT NULL
        ');

        $this->addSql('
            UPDATE claro_template AS t
            LEFT JOIN claro_template_type AS tt ON t.claro_template_type = tt.id
            SET t.entity_type = tt.entity_name 
        ');

        $this->addSql('
            UPDATE claro_template AS t  
            LEFT JOIN claro_template_type AS tt ON t.claro_template_type = tt.id
            SET is_default = 1
            WHERE tt.default_template = t.entity_name
        ');

        $this->addSql('
            ALTER TABLE claro_template
            DROP claro_template_type
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_template 
            ADD claro_template_type INT NOT NULL, 
            DROP entity_type, 
            DROP is_default, 
            DROP description
        ');
        $this->addSql('
            ALTER TABLE claro_template 
            ADD CONSTRAINT FK_DFB26A757428AC44 FOREIGN KEY (claro_template_type) 
            REFERENCES claro_template_type (id) ON UPDATE NO ACTION 
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_DFB26A757428AC44 ON claro_template (claro_template_type)
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
