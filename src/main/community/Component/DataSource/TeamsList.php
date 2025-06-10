<?php

namespace Claroline\CommunityBundle\Component\DataSource;

use Claroline\AppBundle\Component\DataSource\ListSourceComponent;
use Claroline\CommunityBundle\Finder\TeamType;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;

class TeamsList extends ListSourceComponent
{
    public static function getName(): string
    {
        return 'teams';
    }

    public function supportsContext(string $context): bool
    {
        return $context == WorkspaceContext::getName();
    }

    public static function getClass(): string
    {
        return TeamType::class;
    }
}
