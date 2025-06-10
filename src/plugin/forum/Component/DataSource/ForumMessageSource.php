<?php

namespace Claroline\ForumBundle\Component\DataSource;

use Claroline\AppBundle\Component\DataSource\ListSourceComponent;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Component\Context\PublicContext;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\ForumBundle\Finder\MessageType;

class ForumMessageSource extends ListSourceComponent
{
    public static function getName(): string
    {
        return 'forum_messages';
    }

    public function supportsContext(string $context): bool
    {
        return in_array($context, [
            PublicContext::getName(),
            DesktopContext::getName(),
            WorkspaceContext::getName(),
        ]);
    }

    public static function getClass(): string
    {
        return MessageType::class;
    }
}
