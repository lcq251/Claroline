<?php

namespace Claroline\ThemeBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/10 07:42:23
 */
final class Version20241110074222 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_theme 
            ADD striped TINYINT(1) NOT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_theme_user_preferences 
            ADD striped TINYINT(1) NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_theme 
            DROP striped
        ');
        $this->addSql('
            ALTER TABLE claro_theme_user_preferences 
            DROP striped
        ');
    }
}
