<?php

namespace Claroline\ImagePlayerBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller;

class ClarolineImagePlayerInstaller extends AdditionalInstaller
{
    public function hasMigrations(): bool
    {
        return true;
    }
}
