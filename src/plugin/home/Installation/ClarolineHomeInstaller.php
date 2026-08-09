<?php

namespace Claroline\HomeBundle\Installation;

use Claroline\HomeBundle\Installation\Updater\Updater150100;
use Claroline\HomeBundle\Installation\Updater\Updater150101;
use Claroline\InstallationBundle\Additional\AdditionalInstaller;

class ClarolineHomeInstaller extends AdditionalInstaller
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
            '15.0.100' => Updater150100::class,
            '15.0.101' => Updater150101::class,
        ];
    }
}
