<?php

namespace Claroline\SchedulerBundle\Component\Tool;

use Claroline\AppBundle\Component\Tool\ToolComponent;
use Claroline\CoreBundle\Component\Context\AdministrationContext;

class SchedulerTool extends ToolComponent
{
    public static function getName(): string
    {
        return 'scheduler';
    }

    public static function getIcon(): string
    {
        return 'clock';
    }

    public function supportsContext(string $context): bool
    {
        return AdministrationContext::getName() === $context;
    }
}
