<?php

namespace Claroline\AudioPlayerBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/28 01:24:18
 */
final class Version20250228132411 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_audio_params 
            DROP FOREIGN KEY FK_B7FF82AA460D9FD7
        ');
        $this->addSql('
            DROP INDEX IDX_B7FF82AA460D9FD7 ON claro_audio_params
        ');
        $this->addSql('
            ALTER TABLE claro_audio_params 
            ADD url VARCHAR(255) NOT NULL, 
            CHANGE node_id resourceNode_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_audio_params 
            ADD CONSTRAINT FK_B7FF82AAB87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_B7FF82AAB87FAB32 ON claro_audio_params (resourceNode_id)
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_audio_params 
            DROP FOREIGN KEY FK_B7FF82AAB87FAB32
        ');
        $this->addSql('
            DROP INDEX UNIQ_B7FF82AAB87FAB32 ON claro_audio_params
        ');
        $this->addSql('
            ALTER TABLE claro_audio_params 
            CHANGE resourceNode_id node_id INT NOT NULL, 
            DROP url
        ');
        $this->addSql('
            ALTER TABLE claro_audio_params 
            ADD CONSTRAINT FK_B7FF82AA460D9FD7 FOREIGN KEY (node_id) 
            REFERENCES claro_resource_node (id) ON UPDATE NO ACTION 
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_B7FF82AA460D9FD7 ON claro_audio_params (node_id)
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
