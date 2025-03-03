<?php

namespace Claroline\AudioPlayerBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/02/28 01:24:18
 */
final class Version20250228132412 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            UPDATE claro_audio_params AS a
            LEFT JOIN claro_resource_node AS n ON n.id = a.resourceNode_id
            LEFT JOIN claro_file AS f ON n.id = f.resourceNode_id
            SET a.url = f.hash_name
        ');

        $this->addSql('
            DELETE f FROM claro_file AS f
            WHERE EXISTS (
                SELECT n.id
                FROM claro_resource_node AS n
                WHERE n.mime_type LIKE "audio%"
                  AND f.resourceNode_id = n.id
            )
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
