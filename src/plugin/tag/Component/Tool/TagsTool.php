<?php

namespace Claroline\TagBundle\Component\Tool;

use Claroline\AppBundle\Component\Tool\ToolComponent;
use Claroline\CoreBundle\Component\Context\DesktopContext;

class TagsTool extends ToolComponent
{
    public static function getName(): string
    {
        return 'tags';
    }

    public static function getIcon(): string
    {
        return 'tags';
    }

    public function supportsContext(string $context): bool
    {
        return DesktopContext::getName() === $context;
    }
}
