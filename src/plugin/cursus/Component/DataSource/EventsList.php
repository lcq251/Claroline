<?php

namespace Claroline\CursusBundle\Component\DataSource;

use Claroline\AppBundle\Component\DataSource\ListSourceComponent;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CursusBundle\Finder\EventType;

class EventsList extends ListSourceComponent
{
    public static function getName(): string
    {
        return 'training_events';
    }

    public function supportsContext(string $context): bool
    {
        return in_array($context, [
            DesktopContext::getName(),
            WorkspaceContext::getName(),
        ]);
    }

    public static function getClass(): string
    {
        return EventType::class;
    }
}
