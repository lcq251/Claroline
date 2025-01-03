<?php

namespace Claroline\AnnouncementBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/01/03 08:48:07
 */
final class Version20250103084802 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_announcement_tool 
            ADD listFullContent TINYINT(1) NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_announcement_tool 
            DROP listFullContent
        ');
    }
}
