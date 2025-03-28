<?php

namespace UJM\ExoBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/07 10:29:58
 */
final class Version20241107102958 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE ujm_exercise CHANGE date_correction date_correction DATETIME DEFAULT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE ujm_exercise CHANGE date_correction date_correction VARCHAR(255) DEFAULT NULL
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
