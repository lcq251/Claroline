<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\MarkdownBundle\Component\Resource;

use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Mindme\MarkdownBundle\Entity\MindmeMarkdown;

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