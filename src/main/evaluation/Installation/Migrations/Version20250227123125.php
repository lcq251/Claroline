<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/27 12:31:29
 */
final class Version20250227123125 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE innova_path 
            ADD certified TINYINT(1) DEFAULT 0 NOT NULL,  
            ADD certificate_template_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE innova_path 
            ADD CONSTRAINT FK_CE19F05422DEAC6F FOREIGN KEY (certificate_template_id) 
            REFERENCES claro_template (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_CE19F05422DEAC6F ON innova_path (certificate_template_id)
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE innova_path 
            DROP FOREIGN KEY FK_CE19F05422DEAC6F
        ');
        $this->addSql('
            DROP INDEX IDX_CE19F05422DEAC6F ON innova_path
        ');
        $this->addSql('
            ALTER TABLE innova_path 
            DROP certified, 
            DROP certificate_template_id
        ');
    }
}
