<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/12/18 08:17:15
 */
final class Version20241218081714 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE innova_path CHANGE score_total score_total DOUBLE PRECISION DEFAULT 100 NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            ALTER TABLE innova_path CHANGE score_total score_total DOUBLE PRECISION DEFAULT '100' NOT NULL
        ");
    }
}
