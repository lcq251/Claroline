<?php

namespace Claroline\EvaluationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/12/20 07:17:53
 */
final class Version20241220071744 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE claro_evaluation_sequence_evaluation (
                evaluation_date DATETIME DEFAULT NULL, 
                evaluation_status VARCHAR(255) NOT NULL, 
                duration INT DEFAULT NULL, 
                score DOUBLE PRECISION DEFAULT NULL, 
                score_min DOUBLE PRECISION DEFAULT NULL, 
                score_max DOUBLE PRECISION DEFAULT NULL, 
                progression DOUBLE PRECISION NOT NULL, 
                id INT AUTO_INCREMENT NOT NULL, 
                user_id INT DEFAULT NULL, 
                sequence_id INT DEFAULT NULL, 
                INDEX IDX_C008B386A76ED395 (user_id), 
                INDEX IDX_C008B38698FB19AE (sequence_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_evaluation 
            ADD CONSTRAINT FK_C008B386A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_evaluation 
            ADD CONSTRAINT FK_C008B38698FB19AE FOREIGN KEY (sequence_id) 
            REFERENCES innova_path (id) 
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_evaluation 
            DROP FOREIGN KEY FK_C008B386A76ED395
        ');
        $this->addSql('
            ALTER TABLE claro_evaluation_sequence_evaluation 
            DROP FOREIGN KEY FK_C008B38698FB19AE
        ');
        $this->addSql('
            DROP TABLE claro_evaluation_sequence_evaluation
        ');
    }
}
