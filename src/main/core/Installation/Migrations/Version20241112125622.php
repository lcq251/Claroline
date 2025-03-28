<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/12 12:56:26
 */
final class Version20241112125622 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE claro_user_profile_values (
                user_id INT NOT NULL, 
                value_id INT NOT NULL, 
                INDEX IDX_8897A7CCA76ED395 (user_id), 
                UNIQUE INDEX UNIQ_8897A7CCF920BBA2 (value_id), 
                PRIMARY KEY(user_id, value_id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_user_profile_values 
            ADD CONSTRAINT FK_8897A7CCA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_user_profile_values 
            ADD CONSTRAINT FK_8897A7CCF920BBA2 FOREIGN KEY (value_id) 
            REFERENCES claro_field_facet_value (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_field_facet 
            ADD alias VARCHAR(255) DEFAULT NULL, 
            ADD recommended TINYINT(1) NOT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_panel_facet 
            DROP FOREIGN KEY FK_DA3985FFC889F24
        ');
        $this->addSql('
            DROP INDEX IDX_DA3985FFC889F24 ON claro_panel_facet
        ');

        $this->addSql('
            INSERT INTO claro_user_profile_values (user_id, value_id)
                SELECT fv.user_id, fv.id AS value_id
                FROM claro_field_facet_value AS fv
                LEFT JOIN claro_field_facet AS f ON fv.fieldFacet_id = f.id
                LEFT JOIN claro_panel_facet AS pf ON f.panelFacet_id = pf.id
                WHERE pf.facet_id IS NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_user_profile_values 
            DROP FOREIGN KEY FK_8897A7CCA76ED395
        ');
        $this->addSql('
            ALTER TABLE claro_user_profile_values 
            DROP FOREIGN KEY FK_8897A7CCF920BBA2
        ');
        $this->addSql('
            DROP TABLE claro_user_profile_values
        ');
        $this->addSql('
            ALTER TABLE claro_field_facet 
            DROP alias, 
            DROP recommended
        ');
        $this->addSql('
            ALTER TABLE claro_panel_facet 
            ADD facet_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_panel_facet 
            ADD CONSTRAINT FK_DA3985FFC889F24 FOREIGN KEY (facet_id) 
            REFERENCES claro_facet (id) ON UPDATE NO ACTION 
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_DA3985FFC889F24 ON claro_panel_facet (facet_id)
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
