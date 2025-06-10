<?php

namespace Claroline\CommunityBundle\Component\DataSource;

use Claroline\AppBundle\Component\DataSource\ListSourceComponent;
use Claroline\CommunityBundle\Finder\RoleType;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;

class MyRolesList extends ListSourceComponent
{
    public static function getName(): string
    {
        return 'my-roles';
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
        return RoleType::class;
    }
}
