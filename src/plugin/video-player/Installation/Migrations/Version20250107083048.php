<?php

namespace Claroline\VideoPlayerBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/01/07 08:30:53
 */
final class Version20250107083048 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            INSERT INTO claro_video_resource
            (uuid, url, resourceNode_id)
            SELECT f.uuid, f.hash_name AS url, n.id AS resourceNode_id
            FROM claro_file AS f
            LEFT JOIN claro_resource_node AS n ON f.resourceNode_id = n.id
            WHERE n.mime_type LIKE "video%"
        ');

        $this->addSql('
            DELETE f FROM claro_file AS f
            WHERE EXISTS (
                SELECT n.id
                FROM claro_resource_node AS n
                WHERE n.mime_type LIKE "video%"
                  AND f.resourceNode_id = n.id
            )
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
