<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/27 01:47:46
 */
final class Version20250227134743 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_resource_evaluation 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_resource_evaluation SET uuid = (SELECT UUID()) 
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_C2A4B1E7D17F50A6 ON claro_resource_evaluation (uuid)
        ');

        $this->addSql('
            ALTER TABLE claro_resource_user_evaluation 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_resource_user_evaluation SET uuid = (SELECT UUID()) 
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_BCA02E7AD17F50A6 ON claro_resource_user_evaluation (uuid)
        ');

        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_evaluation 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_evaluation_sequence_evaluation SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_C008B386D17F50A6 ON claro_evaluation_sequence_evaluation (uuid)
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            DROP INDEX UNIQ_C008B386D17F50A6 ON claro_evaluation_sequence_evaluation
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_evaluation 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_C2A4B1E7D17F50A6 ON claro_resource_evaluation
        ');
        $this->addSql('
            ALTER TABLE claro_resource_evaluation 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_BCA02E7AD17F50A6 ON claro_resource_user_evaluation
        ');
        $this->addSql('
            ALTER TABLE claro_resource_user_evaluation 
            DROP uuid
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
