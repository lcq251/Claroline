<?php

namespace Claroline\ImagePlayerBundle\Installation;

use Claroline\ImagePlayerBundle\Installation\Updater\Updater150000;
use Claroline\InstallationBundle\Additional\AdditionalInstaller;

class ClarolineImagePlayerInstaller extends AdditionalInstaller
{
    public static function getUpdaters(): array
    {
        return [
            '15.0.0' => Updater150000::class,
        ];
    }

    public function hasMigrations(): bool
    {
        return true;
    }
}
