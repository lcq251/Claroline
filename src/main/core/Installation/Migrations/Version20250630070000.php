<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250630070000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_widget_instance 
            ADD data_source_name VARCHAR(255) DEFAULT NULL
        ');

        $this->addSql('
            UPDATE claro_widget_instance AS i
            LEFT JOIN claro_data_source AS d ON i.dataSource_id = d.id 
            SET i.data_source_name = d.source_name
            WHERE i.dataSource_id IS NOT NULL
        ');

        $this->addSql('
            ALTER TABLE claro_widget_instance 
            DROP FOREIGN KEY FK_5F89A385F3D3127E
        ');
        $this->addSql('
            DROP INDEX IDX_5F89A385F3D3127E ON claro_widget_instance
        ');
        $this->addSql('
            ALTER TABLE claro_widget_instance  
            DROP dataSource_id
        ');

        // migrates admin_tools source, which have been deleted
        $this->addSql('
            UPDATE claro_widget_instance SET data_source_name = "tools" WHERE data_source_name = "admin_tools"
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_widget_instance 
            ADD dataSource_id INT DEFAULT NULL, 
            DROP data_source_name
        ');
        $this->addSql('
            ALTER TABLE claro_widget_instance 
            ADD CONSTRAINT FK_5F89A385F3D3127E FOREIGN KEY (dataSource_id) 
            REFERENCES claro_data_source (id) ON UPDATE NO ACTION 
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_5F89A385F3D3127E ON claro_widget_instance (dataSource_id)
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
