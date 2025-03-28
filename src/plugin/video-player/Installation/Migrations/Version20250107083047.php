<?php

namespace Claroline\VideoPlayerBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/01/07 08:30:53
 */
final class Version20250107083047 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE claro_video_resource (
                id INT AUTO_INCREMENT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                url VARCHAR(255) NOT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_143EFE7BD17F50A6 (uuid), 
                UNIQUE INDEX UNIQ_143EFE7BB87FAB32 (resourceNode_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_video_resource 
            ADD CONSTRAINT FK_143EFE7BB87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_video_resource 
            DROP FOREIGN KEY FK_143EFE7BB87FAB32
        ');
        $this->addSql('
            DROP TABLE claro_video_resource
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
