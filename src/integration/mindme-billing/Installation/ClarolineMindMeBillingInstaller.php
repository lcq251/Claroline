<?php

namespace Claroline\MindMeBillingBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller;

class ClarolineMindMeBillingInstaller extends AdditionalInstaller
{
    public function hasMigrations(): bool
    {
        return true;
    }
}
