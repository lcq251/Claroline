<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/15 11:25:22
 */
final class Version20250215112520 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE claro_evaluation_sequence_assignment (
                required TINYINT(1) DEFAULT 0 NOT NULL, 
                scored TINYINT(1) DEFAULT 0 NOT NULL, 
                id INT AUTO_INCREMENT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                sequence_id INT DEFAULT NULL, 
                role_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_E3EE5249D17F50A6 (uuid), 
                INDEX IDX_E3EE524998FB19AE (sequence_id), 
                INDEX IDX_E3EE5249D60322AC (role_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE claro_evaluation_sequence_requirement (
                progression DOUBLE PRECISION DEFAULT NULL, 
                minScore DOUBLE PRECISION DEFAULT NULL, 
                maxScore DOUBLE PRECISION DEFAULT NULL, 
                id INT AUTO_INCREMENT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                sequence_id INT DEFAULT NULL, 
                required_sequence_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_FF58DDE0D17F50A6 (uuid), 
                INDEX IDX_FF58DDE098FB19AE (sequence_id), 
                INDEX IDX_FF58DDE0D8B8753E (required_sequence_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_assignment 
            ADD CONSTRAINT FK_E3EE524998FB19AE FOREIGN KEY (sequence_id) 
            REFERENCES innova_path (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_assignment 
            ADD CONSTRAINT FK_E3EE5249D60322AC FOREIGN KEY (role_id) 
            REFERENCES claro_role (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_requirement 
            ADD CONSTRAINT FK_FF58DDE098FB19AE FOREIGN KEY (sequence_id) 
            REFERENCES innova_path (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_requirement 
            ADD CONSTRAINT FK_FF58DDE0D8B8753E FOREIGN KEY (required_sequence_id) 
            REFERENCES innova_path (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE innova_step 
            ADD required TINYINT(1) DEFAULT 0 NOT NULL, 
            ADD scored TINYINT(1) DEFAULT 0 NOT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_resource_evaluation 
            ADD started_at DATETIME DEFAULT NULL, 
            ADD ended_at DATETIME DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_resource_user_evaluation 
            ADD started_at DATETIME DEFAULT NULL, 
            ADD ended_at DATETIME DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_evaluation 
            ADD started_at DATETIME DEFAULT NULL, 
            ADD ended_at DATETIME DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_workspace_evaluation 
            ADD started_at DATETIME DEFAULT NULL, 
            ADD ended_at DATETIME DEFAULT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_assignment 
            DROP FOREIGN KEY FK_E3EE524998FB19AE
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_assignment 
            DROP FOREIGN KEY FK_E3EE5249D60322AC
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_requirement 
            DROP FOREIGN KEY FK_FF58DDE098FB19AE
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_requirement 
            DROP FOREIGN KEY FK_FF58DDE0D8B8753E
        ');
        $this->addSql('
            DROP TABLE claro_evaluation_sequence_assignment
        ');
        $this->addSql('
            DROP TABLE claro_evaluation_sequence_requirement
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_evaluation 
            DROP started_at, 
            DROP ended_at
        ');
        $this->addSql('
            ALTER TABLE claro_resource_evaluation 
            DROP started_at, 
            DROP ended_at
        ');
        $this->addSql('
            ALTER TABLE claro_resource_user_evaluation 
            DROP started_at, 
            DROP ended_at
        ');
        $this->addSql('
            ALTER TABLE claro_workspace_evaluation 
            DROP started_at, 
            DROP ended_at
        ');
        $this->addSql('
            ALTER TABLE innova_step 
            DROP required, 
            DROP scored
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
