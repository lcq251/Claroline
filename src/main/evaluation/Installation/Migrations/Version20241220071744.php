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

        $this->addSql('
            INSERT INTO claro_evaluation_sequence_evaluation
            (sequence_id, user_id, evaluation_date, evaluation_status, duration, score, score_min, score_max, progression)
            SELECT p.id as sequence_id, e.user_id, e.evaluation_date, e.evaluation_status, e.duration, e.score, e.score_min, e.score_max, e.progression
            FROM claro_resource_user_evaluation AS e
            LEFT JOIN claro_resource_node AS n ON e.resource_node = n.id
            LEFT JOIN innova_path AS p ON p.resourceNode_id = n.id
            WHERE n.mime_type = "custom/innova_path" 
              AND p.id IS NOT NULL
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

    public function isTransactional(): bool
    {
        return false;
    }
}
