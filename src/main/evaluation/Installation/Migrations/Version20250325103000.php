<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250325103000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE `innova_path` SET success_condition = NULL WHERE success_condition LIKE "[]"
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
