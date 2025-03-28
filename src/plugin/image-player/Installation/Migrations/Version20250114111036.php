<?php

namespace Claroline\ImagePlayerBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/01/14 11:10:42
 */
final class Version20250114111036 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE claro_image_resource (
                id INT AUTO_INCREMENT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                url VARCHAR(255) NOT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_334C426FD17F50A6 (uuid), 
                UNIQUE INDEX UNIQ_334C426FB87FAB32 (resourceNode_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_image_resource 
            ADD CONSTRAINT FK_334C426FB87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ');

        $this->addSql('
            INSERT INTO claro_image_resource
            (uuid, url, resourceNode_id)
            SELECT f.uuid, f.hash_name AS url, n.id AS resourceNode_id
            FROM claro_file AS f
            LEFT JOIN claro_resource_node AS n ON f.resourceNode_id = n.id
            WHERE n.mime_type LIKE "image%"
        ');

        $this->addSql('
            DELETE f FROM claro_file AS f
            WHERE EXISTS (
                SELECT n.id
                FROM claro_resource_node AS n
                WHERE n.mime_type LIKE "image%"
                  AND f.resourceNode_id = n.id
            )
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_image_resource 
            DROP FOREIGN KEY FK_334C426FB87FAB32
        ');
        $this->addSql('
            DROP TABLE claro_image_resource
        ');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
