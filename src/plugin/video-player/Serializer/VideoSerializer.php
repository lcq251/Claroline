<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\VideoPlayerBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\VideoPlayerBundle\Entity\Video;

class VideoSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return Video::class;
    }

    public function getName(): string
    {
        return 'video';
    }

    public function serialize(Video $video, array $options = []): array
    {
        return [
            'url' => $video->getUrl(),
        ];
    }

    public function deserialize(array $data, Video $video, array $options = []): Video
    {
        $this->sipe('url', 'setUrl', $data, $video);

        return $video;
    }
}
