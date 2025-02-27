<?php

namespace UJM\ExoBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250227103000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE ujm_exercise SET numbering = "literal" WHERE numbering = "litteral"
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
