<?php

namespace Icap\LessonBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller;
use Icap\LessonBundle\Installation\Updater\Updater150000;

class IcapLessonInstaller extends AdditionalInstaller
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
