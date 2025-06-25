<?php

namespace Claroline\OpenBadgeBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/06/24 01:00:38
 */
final class Version20250624130036 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro__open_badge_badge_class 
            DROP FOREIGN KEY FK_7A1CAEBEBB9D6FEE
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_badge_class 
            ADD CONSTRAINT FK_7A1CAEBEBB9D6FEE FOREIGN KEY (issuer_id) 
            REFERENCES claro__organization (id) 
            ON DELETE SET NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro__open_badge_badge_class 
            DROP FOREIGN KEY FK_7A1CAEBEBB9D6FEE
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_badge_class 
            ADD CONSTRAINT FK_7A1CAEBEBB9D6FEE FOREIGN KEY (issuer_id) 
            REFERENCES claro__organization (id) ON UPDATE NO ACTION ON DELETE NO ACTION
        ');
    }

    public function isTransactional(): bool
    {
        // MySQL/PostgreSQL does not support DDL queries in transactions
        // You can remove this override if your migration does not contain DDL queries
        return false;
    }
}
