<?php

namespace Claroline\HomeBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250305100000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_widget_container_config SET backgroundType = "none" WHERE background = "#FFFFFF" OR background = "#FFF" 
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
