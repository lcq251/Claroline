<?php

namespace Claroline\ScormBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2025/01/17 10:02:56
 */
final class Version20250117100255 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_scorm_sco 
            CHANGE score_decimal score_decimal DOUBLE PRECISION DEFAULT NULL, 
            CHANGE completion_threshold completion_threshold DOUBLE PRECISION DEFAULT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_scorm_sco CHANGE score_decimal score_decimal NUMERIC(10, 7) DEFAULT NULL, 
            CHANGE completion_threshold completion_threshold NUMERIC(10, 7) DEFAULT NULL
        ');
    }
}
