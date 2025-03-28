<?php

namespace Claroline\CommunityBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/12 07:26:24
 */
final class Version20241112072622 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE claro_user_profile (
                id INT AUTO_INCREMENT NOT NULL, 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE claro_user_profile_sections (
                profile_id INT NOT NULL, 
                section_id INT NOT NULL, 
                INDEX IDX_73250670CCFA12B8 (profile_id), 
                UNIQUE INDEX UNIQ_73250670D823E37A (section_id), 
                PRIMARY KEY(profile_id, section_id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_user_profile_sections 
            ADD CONSTRAINT FK_73250670CCFA12B8 FOREIGN KEY (profile_id) 
            REFERENCES claro_user_profile (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_user_profile_sections 
            ADD CONSTRAINT FK_73250670D823E37A FOREIGN KEY (section_id) 
            REFERENCES claro_panel_facet (id) 
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_user_profile_sections 
            DROP FOREIGN KEY FK_73250670CCFA12B8
        ');
        $this->addSql('
            ALTER TABLE claro_user_profile_sections 
            DROP FOREIGN KEY FK_73250670D823E37A
        ');
        $this->addSql('
            DROP TABLE claro_user_profile
        ');
        $this->addSql('
            DROP TABLE claro_user_profile_sections
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
