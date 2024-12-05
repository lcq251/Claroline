<?php

namespace Claroline\AnnouncementBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2024/12/04 06:52:46
 */
final class Version20241204065242 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE claro_announcement_tool (
                id INT AUTO_INCREMENT NOT NULL, 
                tool_id INT DEFAULT NULL, 
                email_template_id INT DEFAULT NULL, 
                pdf_template_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_D2C989048F7B22CC (tool_id), 
                INDEX IDX_D2C98904131A730F (email_template_id), 
                INDEX IDX_D2C98904CA5AA7D3 (pdf_template_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_announcement_tool 
            ADD CONSTRAINT FK_D2C989048F7B22CC FOREIGN KEY (tool_id) 
            REFERENCES claro_ordered_tool (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_announcement_tool 
            ADD CONSTRAINT FK_D2C98904131A730F FOREIGN KEY (email_template_id) 
            REFERENCES claro_template (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            ALTER TABLE claro_announcement_tool 
            ADD CONSTRAINT FK_D2C98904CA5AA7D3 FOREIGN KEY (pdf_template_id) 
            REFERENCES claro_template (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            ALTER TABLE claro_announcement 
            DROP FOREIGN KEY FK_778754E3D0BBCCBE
        ');
        $this->addSql('
            DROP INDEX IDX_778754E3D0BBCCBE ON claro_announcement
        ');
        $this->addSql('
            ALTER TABLE claro_announcement 
            ADD workspace_id INT DEFAULT NULL
        ');

        $this->addSql('
            UPDATE claro_announcement AS a
            LEFT JOIN claro_announcement_aggregate AS ag ON (a.aggregate_id = ag.id)
            LEFT JOIN claro_resource_node AS rn ON (ag.resourceNode_id = rn.id)
            SET a.workspace_id = rn.workspace_id
        ');

        $this->addSql('
            ALTER TABLE claro_announcement  
            DROP aggregate_id
        ');

        $this->addSql('
            ALTER TABLE claro_announcement 
            ADD CONSTRAINT FK_778754E382D40A1F FOREIGN KEY (workspace_id) 
            REFERENCES claro_workspace (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_778754E382D40A1F ON claro_announcement (workspace_id)
        ');

        $this->addSql('
            INSERT INTO claro_tool_rights
            (role_id, ordered_tool_id, mask)
            SELECT r.id AS role_id, ot.id AS ordered_tool_id, 1 AS mask
            FROM claro_ordered_tool AS ot
            LEFT JOIN claro_role AS r ON (r.name = CONCAT("ROLE_WS_COLLABORATOR_", ot.context_id))
            WHERE ot.tool_name = "announcement"
              AND r.id IS NOT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('
            ALTER TABLE claro_announcement_tool 
            DROP FOREIGN KEY FK_D2C989048F7B22CC
        ');
        $this->addSql('
            ALTER TABLE claro_announcement_tool 
            DROP FOREIGN KEY FK_D2C98904131A730F
        ');
        $this->addSql('
            ALTER TABLE claro_announcement_tool 
            DROP FOREIGN KEY FK_D2C98904CA5AA7D3
        ');
        $this->addSql('
            DROP TABLE claro_announcement_tool
        ');
        $this->addSql('
            ALTER TABLE claro_announcement 
            DROP FOREIGN KEY FK_778754E382D40A1F
        ');
        $this->addSql('
            DROP INDEX IDX_778754E382D40A1F ON claro_announcement
        ');
        $this->addSql('
            ALTER TABLE claro_announcement 
            ADD aggregate_id INT NOT NULL, 
            DROP workspace_id
        ');
        $this->addSql('
            ALTER TABLE claro_announcement 
            ADD CONSTRAINT FK_778754E3D0BBCCBE FOREIGN KEY (aggregate_id) 
            REFERENCES claro_announcement_aggregate (id) ON UPDATE NO ACTION 
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_778754E3D0BBCCBE ON claro_announcement (aggregate_id)
        ');
    }
}
