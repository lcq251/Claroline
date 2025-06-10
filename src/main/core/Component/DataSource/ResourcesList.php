<?php

namespace Claroline\CoreBundle\Component\DataSource;

use Claroline\AppBundle\Component\DataSource\ListSourceComponent;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Component\Context\PublicContext;
use Claroline\CoreBundle\Controller\Workspace\WorkspaceController;
use Claroline\CoreBundle\Finder\ResourceNodeType;

final class ResourcesList extends ListSourceComponent
{
    public static function getName(): string
    {
        return 'resources';
    }

    public function supportsContext(string $context): bool
    {
        return in_array($context, [
            PublicContext::getName(),
            DesktopContext::getName(),
            WorkspaceController::getName(),
        ]);
    }

    public static function getClass(): string
    {
        return ResourceNodeType::class;
    }
}
