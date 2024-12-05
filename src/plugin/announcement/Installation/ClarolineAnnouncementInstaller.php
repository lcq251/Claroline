<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AnnouncementBundle\Installation;

use Claroline\AnnouncementBundle\Installation\Updater\Updater150000;
use Claroline\InstallationBundle\Additional\AdditionalInstaller;

class ClarolineAnnouncementInstaller extends AdditionalInstaller
{
    public function hasMigrations(): bool
    {
        return true;
    }

    public function hasFixtures(): bool
    {
        return true;
    }

    public static function getUpdaters(): array
    {
        return [
            '15.0.0' => Updater150000::class,
        ];
    }
}
