<?php

namespace Claroline\ClacoFormBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/11/12 12:56:26
 */
final class Version20241205080000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_clacoformbundle_claco_form SET display = "table" WHERE display = "table-sm"
        ');
        $this->addSql('
            UPDATE claro_clacoformbundle_claco_form SET display = "tiles" WHERE display = "tiles-sm"
        ');
        $this->addSql('
            UPDATE claro_clacoformbundle_claco_form SET display = "list" WHERE display = "list-sm"
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
