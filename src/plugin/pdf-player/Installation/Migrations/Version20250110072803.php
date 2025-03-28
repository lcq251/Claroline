<?php

namespace Claroline\PdfPlayerBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/01/10 07:28:09
 */
final class Version20250110072803 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            INSERT INTO claro_pdf_resource
            (uuid, url, resourceNode_id)
            SELECT f.uuid, f.hash_name AS url, n.id AS resourceNode_id
            FROM claro_file AS f
            LEFT JOIN claro_resource_node AS n ON f.resourceNode_id = n.id
            WHERE n.mime_type = "application/pdf"
        ');

        $this->addSql('
            DELETE f FROM claro_file AS f
            WHERE EXISTS (
                SELECT n.id
                FROM claro_resource_node AS n
                WHERE n.mime_type = "application/pdf"
                  AND f.resourceNode_id = n.id
            )
        ');
    }

    public function down(Schema $schema): void
    {
    }
}
