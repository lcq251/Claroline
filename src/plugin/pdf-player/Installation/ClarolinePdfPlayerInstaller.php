<?php

namespace Claroline\PdfPlayerBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller;
use Claroline\PdfPlayerBundle\Installation\Updater\Updater150000;

class ClarolinePdfPlayerInstaller extends AdditionalInstaller
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
