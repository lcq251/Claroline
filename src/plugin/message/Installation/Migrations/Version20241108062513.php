<?php

namespace Claroline\MessageBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/08 06:25:17
 */
final class Version20241108062513 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_user_message 
            DROP last_open_date
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_user_message 
            ADD last_open_date DATETIME DEFAULT NULL
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
