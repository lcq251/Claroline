<?php

namespace Claroline\MindMeBillingBundle;

use Claroline\KernelBundle\Bundle\DistributionPluginBundle;

class ClarolineMindMeBillingBundle extends DistributionPluginBundle
{
    public function getDescription(): string
    {
        return 'MindMe Billing — WeChat Pay & Alipay integration for Claroline';
    }

    public function getRequiredPlugins(): array
    {
        return [
            'Claroline\\CursusBundle\\ClarolineCursusBundle',
        ];
    }
}
