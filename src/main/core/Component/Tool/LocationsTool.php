<?php

namespace Claroline\CoreBundle\Component\Tool;

use Claroline\AppBundle\Component\Tool\ToolComponent;
use Claroline\CoreBundle\Component\Context\DesktopContext;

class LocationsTool extends ToolComponent
{
    public static function getName(): string
    {
        return 'locations';
    }

    public static function getIcon(): string
    {
        return 'map-marker-alt';
    }

    public function supportsContext(string $context): bool
    {
        return DesktopContext::getName() === $context;
    }
}
