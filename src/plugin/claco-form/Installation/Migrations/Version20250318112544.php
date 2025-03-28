<?php

namespace Claroline\ClacoFormBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/03/18 11:25:45
 */
final class Version20250318112544 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_clacoformbundle_entry_user 
            DROP notify_comment, 
            DROP notify_vote
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_clacoformbundle_entry_user 
            ADD notify_comment TINYINT(1) NOT NULL, 
            ADD notify_vote TINYINT(1) NOT NULL
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
