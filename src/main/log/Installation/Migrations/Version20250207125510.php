<?php

namespace Claroline\LogBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/07 12:55:20
 */
final class Version20250207125510 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_log_operational CHANGE parentId parentId VARCHAR(255) DEFAULT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_log_operational CHANGE parentId parentId VARCHAR(255) NOT NULL
        ');
    }
}
