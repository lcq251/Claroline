<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Adds pure-config avatar fields (fit / zoom / avatarName / welcome /
 * greeting / fallback / suggestions) to the Aiteacher resource defaults and
 * the per-user UserAvatar override, so the digital-teacher appearance and
 * greeting copy can be customised per resource and per user.
 */
final class Version20260915000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add avatar appearance + greeting fields to aiteacher and user avatar.';
    }

    public function up(Schema $schema): void
    {
        $cols = 'fit VARCHAR(8) DEFAULT NULL, zoom INT DEFAULT NULL, avatarName VARCHAR(64) DEFAULT NULL, welcome VARCHAR(500) DEFAULT NULL, greeting VARCHAR(500) DEFAULT NULL, fallback VARCHAR(800) DEFAULT NULL, suggestions JSON DEFAULT NULL';

        $this->addSql("ALTER TABLE mindme_aiteacher ADD COLUMN {$cols}");
        $this->addSql("ALTER TABLE mindme_user_avatar ADD COLUMN {$cols}");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mindme_aiteacher DROP COLUMN fit, DROP COLUMN zoom, DROP COLUMN avatarName, DROP COLUMN welcome, DROP COLUMN greeting, DROP COLUMN fallback, DROP COLUMN suggestions');
        $this->addSql('ALTER TABLE mindme_user_avatar DROP COLUMN fit, DROP COLUMN zoom, DROP COLUMN avatarName, DROP COLUMN welcome, DROP COLUMN greeting, DROP COLUMN fallback, DROP COLUMN suggestions');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
