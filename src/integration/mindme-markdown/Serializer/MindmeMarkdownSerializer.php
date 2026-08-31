<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\MarkdownBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Mindme\MarkdownBundle\Entity\MindmeMarkdown;

/**
 * Serializer for MindmeMarkdown resource type.
 * Serializes/deserializes the markdown content field.
 */
class MindmeMarkdownSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return MindmeMarkdown::class;
    }

    public function getName(): string
    {
        return 'mindme_markdown';
    }

    public function serialize(MindmeMarkdown $md, array $options = []): array
    {
        return [
            'content' => $md->getContent() ?? '',
        ];
    }

    public function deserialize($data, MindmeMarkdown $md, array $options = []): MindmeMarkdown
    {
        $this->sipe('content', 'setContent', $data, $md);

        return $md;
    }
}