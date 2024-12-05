<?php

namespace Claroline\CoreBundle\Component\Tool;

use Claroline\AppBundle\Component\Tool\ToolComponent;
use Claroline\CoreBundle\Component\Context\AdministrationContext;

class ConnectionMessagesTool extends ToolComponent
{
    public static function getName(): string
    {
        return 'connection_messages';
    }

    public static function getIcon(): string
    {
        return 'comments-dots';
    }

    public function supportsContext(string $context): bool
    {
        return AdministrationContext::getName() === $context;
    }
}
