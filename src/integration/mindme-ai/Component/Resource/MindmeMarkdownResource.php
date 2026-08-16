<?php

namespace Claroline\MindMeAiBundle\Component\Resource;

use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\MindMeAiBundle\Entity\MindmeMarkdown;

final class MindmeMarkdownResource extends ResourceComponent
{
    public static function getName(): string
    {
        return 'mindme_markdown';
    }

    public static function getClass(): string
    {
        return MindmeMarkdown::class;
    }
}