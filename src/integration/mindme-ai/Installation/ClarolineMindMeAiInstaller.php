<?php

namespace Claroline\MindMeAiBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller;

class ClarolineMindMeAiInstaller extends AdditionalInstaller
{
    public function hasMigrations(): bool
    {
        return true;
    }
}
