<?php

namespace Claroline\CommunityBundle\Component\DataSource;

use Claroline\AppBundle\Component\DataSource\ListSourceComponent;
use Claroline\CommunityBundle\Finder\RoleType;
use Claroline\CoreBundle\Component\Context\AdministrationContext;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;

class RolesList extends ListSourceComponent
{
    public static function getName(): string
    {
        return 'roles';
    }

    public function supportsContext(string $context): bool
    {
        return in_array($context, [
            DesktopContext::getName(),
            AdministrationContext::getName(),
            WorkspaceContext::getName(),
        ]);
    }

    public static function getClass(): string
    {
        return RoleType::class;
    }
}
