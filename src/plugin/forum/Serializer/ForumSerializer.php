<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\ForumBundle\Entity\Forum;

class ForumSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return Forum::class;
    }

    public function getName(): string
    {
        return 'forum';
    }

    public function getSchema(): string
    {
        return '#/plugin/forum/forum.json';
    }

    public function getSamples(): string
    {
        return '#/plugin/forum/forum';
    }

    public function serialize(Forum $forum, ?array $options = []): array
    {
        return [
            'id' => $forum->getUuid(),
        ];
    }

    public function deserialize(array $data, Forum $forum, ?array $options = []): Forum
    {
        return $forum;
    }
}
