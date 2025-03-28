<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/12/06 06:40:06
 */
final class Version20241206063957 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_resource_node 
            DROP license, 
            DROP author
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_resource_node 
            ADD license VARCHAR(255) DEFAULT NULL, 
            ADD author VARCHAR(255) DEFAULT NULL
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
