<?php

namespace UJM\ExoBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/10/17 05:43:14
 */
final class Version20241017054312 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE ujm_question CHANGE invite content LONGTEXT DEFAULT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE ujm_question CHANGE content invite LONGTEXT DEFAULT NULL
        ');
    }
}
