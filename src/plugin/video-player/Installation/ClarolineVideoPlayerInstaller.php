<?php

namespace Claroline\VideoPlayerBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller;
use Claroline\VideoPlayerBundle\Installation\Updater\Updater150000;

class ClarolineVideoPlayerInstaller extends AdditionalInstaller
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
