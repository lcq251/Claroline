<?php

namespace Claroline\PdfPlayerBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller;

class ClarolinePdfPlayerInstaller extends AdditionalInstaller
{
    public function hasMigrations(): bool
    {
        return true;
    }
}
