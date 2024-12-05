<?php

namespace Claroline\ExampleBundle\Component\Tool;

use Claroline\AppBundle\Component\Tool\ToolComponent;
use Claroline\CoreBundle\Component\Context\DesktopContext;

class ExampleTool extends ToolComponent
{
    public static function getName(): string
    {
        return 'example';
    }

    public static function getIcon(): string
    {
        return 'tools';
    }

    public function supportsContext(string $context): bool
    {
        return DesktopContext::getName() === $context;
    }
}
