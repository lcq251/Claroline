<?php

namespace Claroline\CursusBundle\Installation;

use Claroline\CursusBundle\Installation\Updater\Updater142000;
use Claroline\CursusBundle\Installation\Updater\Updater150000;
use Claroline\InstallationBundle\Additional\AdditionalInstaller;

class ClarolineCursusInstaller extends AdditionalInstaller
{
    public function hasMigrations(): bool
    {
        return true;
    }

    public static function getUpdaters(): array
    {
        return [
            '14.2.0' => Updater142000::class,
            '15.0.0' => Updater150000::class,
        ];
    }
}
