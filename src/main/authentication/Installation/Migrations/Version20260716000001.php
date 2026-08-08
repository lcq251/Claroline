<?php

namespace Claroline\AuthenticationBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260716000001 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE IF NOT EXISTS claro_thirdpart_user (
                id INT AUTO_INCREMENT NOT NULL,
                user_id INT NOT NULL,
                uuid VARCHAR(36) NOT NULL,
                platform VARCHAR(50) NOT NULL,
                platform_id VARCHAR(255) NOT NULL,
                raw_data JSON DEFAULT NULL,
                created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
                updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
                UNIQUE INDEX UNIQ_THIRDPART_UUID (uuid),
                UNIQUE INDEX unique_platform_id (platform, platform_id),
                UNIQUE INDEX UNIQ_THIRDPART_USER (user_id),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB
        ');

        $this->addSql('
            ALTER TABLE claro_thirdpart_user
            ADD CONSTRAINT FK_THIRDPART_USER
            FOREIGN KEY (user_id)
            REFERENCES claro_user (id)
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE claro_thirdpart_user');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
