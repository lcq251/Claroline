<?php

namespace Claroline\OpenBadgeBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/03/19 09:24:41
 */
final class Version20250319092440 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro__open_badge_badge_class SET description_html = description WHERE description IS NOT NULL
        ');

        $this->addSql('
            UPDATE claro__open_badge_badge_class SET description = null WHERE description IS NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro__open_badge_badge_class 
            DROP description_html
        ');
    }
}
