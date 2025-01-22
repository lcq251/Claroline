<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250122100000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_resource_user_evaluation SET evaluation_status = "not_attempted" WHERE evaluation_status = "todo" OR evaluation_status = "opened"
        ');

        $this->addSql('
            UPDATE claro_resource_user_evaluation SET evaluation_status = "completed" WHERE evaluation_status = "participated"
        ');
        $this->addSql('
            UPDATE claro_resource_evaluation SET evaluation_status = "completed" WHERE evaluation_status = "participated"
        ');

        $this->addSql('
            UPDATE claro_evaluation_sequence_evaluation SET evaluation_status = "not_attempted" WHERE evaluation_status = "todo" OR evaluation_status = "opened"
        ');

        $this->addSql('
            UPDATE claro_workspace_evaluation SET evaluation_status = "not_attempted" WHERE evaluation_status = "todo" OR evaluation_status = "opened"
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
