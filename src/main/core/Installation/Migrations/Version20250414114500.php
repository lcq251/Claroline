<?php

namespace Claroline\CoreBundle\Installation\Migrations;

use Claroline\InstallationBundle\Migrations\Helper\ConditionalMigrationTrait;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250414114500 extends AbstractMigration
{
    use ConditionalMigrationTrait;

    public function up(Schema $schema): void
    {
        if ($this->checkTableExists('claro_workspace_favourite', $this->connection)) {
            return;
        }

        $this->addSql('
            CREATE TABLE claro_workspace_favourite (
                id INT AUTO_INCREMENT NOT NULL, 
                user_id INT DEFAULT NULL, 
                workspace_id INT NOT NULL, 
                INDEX IDX_711A30BA76ED395 (user_id), 
                INDEX IDX_711A30B82D40A1F (workspace_id), 
                UNIQUE INDEX UNIQ_711A30B82D40A1FA76ED395 (workspace_id, user_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_workspace_favourite 
            ADD CONSTRAINT FK_711A30BA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_workspace_favourite 
            ADD CONSTRAINT FK_711A30B82D40A1F FOREIGN KEY (workspace_id) 
            REFERENCES claro_workspace (id) 
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_workspace_favourite 
            DROP FOREIGN KEY FK_711A30BA76ED395
        ');
        $this->addSql('
            ALTER TABLE claro_workspace_favourite 
            DROP FOREIGN KEY FK_711A30B82D40A1F
        ');
        $this->addSql('
            DROP TABLE claro_workspace_favourite
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
