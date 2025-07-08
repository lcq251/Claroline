<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Claroline\InstallationBundle\Migrations\Helper\ConditionalMigrationTrait;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/26 05:17:56
 */
final class Version20250226171749 extends AbstractMigration
{
    use ConditionalMigrationTrait;

    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_resource_node 
            ADD downloadable TINYINT(1) DEFAULT 0 NOT NULL
        ');

        if ($this->checkTableExists('claro_slide', $this->connection)) {
            // there is no cascade on slides, and it will break on the plugin removal
            // if the table is not empty
            $this->addSql('
                DELETE FROM claro_slide
            ');
        }
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_resource_node 
            DROP downloadable
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
