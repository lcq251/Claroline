<?php

namespace Claroline\TemplateBundle\Installation\Migrations;

use Claroline\InstallationBundle\Migrations\Helper\ConditionalMigrationTrait;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/11 07:44:54
 */
final class Version20241111074450 extends AbstractMigration
{
    use ConditionalMigrationTrait;

    public function up(Schema $schema): void
    {
        if (!$this->checkTableExists('claro_template', $this->connection)) {
            $this->addSql('
                CREATE TABLE claro_template (
                    entity_type VARCHAR(255) NOT NULL, 
                    is_default TINYINT(1) NOT NULL, 
                    is_system TINYINT(1) NOT NULL, 
                    id INT AUTO_INCREMENT NOT NULL, 
                    uuid VARCHAR(36) NOT NULL, 
                    entity_name VARCHAR(255) NOT NULL, 
                    description LONGTEXT DEFAULT NULL, 
                    UNIQUE INDEX UNIQ_DFB26A75D17F50A6 (uuid), 
                    PRIMARY KEY(id)
                ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
            ');
            $this->addSql('
                CREATE TABLE claro_template_content (
                    title VARCHAR(255) DEFAULT NULL, 
                    content LONGTEXT DEFAULT NULL, 
                    lang VARCHAR(255) NOT NULL, 
                    id INT AUTO_INCREMENT NOT NULL, 
                    template_id INT NOT NULL, 
                    INDEX IDX_1D5C077D5DA0FB8 (template_id), 
                    UNIQUE INDEX template_unique_lang (template_id, lang), 
                    PRIMARY KEY(id)
                ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
            ');
            $this->addSql('
                ALTER TABLE claro_template_content 
                ADD CONSTRAINT FK_1D5C077D5DA0FB8 FOREIGN KEY (template_id) 
                REFERENCES claro_template (id) 
                ON DELETE CASCADE
            ');
        } else {
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
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_template_content 
            DROP FOREIGN KEY FK_1D5C077D5DA0FB8
        ');
        $this->addSql('
            DROP TABLE claro_template
        ');
        $this->addSql('
            DROP TABLE claro_template_content
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
