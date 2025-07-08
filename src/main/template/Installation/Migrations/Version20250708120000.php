<?php

namespace Claroline\TemplateBundle\Installation\Migrations;

use Claroline\InstallationBundle\Migrations\Helper\ConditionalMigrationTrait;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250708120000 extends AbstractMigration
{
    use ConditionalMigrationTrait;

    public function up(Schema $schema): void
    {
        $this->addSql('
            DELETE FROM claro_template WHERE is_system = true
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
