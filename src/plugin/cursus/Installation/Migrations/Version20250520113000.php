<?php

namespace Claroline\CursusBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250520113000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_ordered_tool SET tool_name = "trainings" WHERE tool_name = "training_events"
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
