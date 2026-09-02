<?php

namespace Mindme\AibaseBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Extends the aibase resource connection configuration.
 *
 * Adds the platform connection columns (platformType + baseUrl) and a
 * user-defined JSON extension column (extraConfig). Restriction logic is
 * unchanged (none | time | count).
 */
final class Version20260901100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add platform connection + JSON extension columns to aibase.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD platformType VARCHAR(30) DEFAULT NULL");
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD baseUrl VARCHAR(255) DEFAULT NULL");
        $this->addSql("ALTER TABLE mindme_aibase_lesson ADD extraConfig LONGTEXT DEFAULT NULL COMMENT '(DC2Type:json)'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN extraConfig');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN baseUrl');
        $this->addSql('ALTER TABLE mindme_aibase_lesson DROP COLUMN platformType');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}