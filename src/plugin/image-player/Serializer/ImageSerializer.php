<?php

namespace Claroline\ImagePlayerBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\ImagePlayerBundle\Entity\Image;

class ImageSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return Image::class;
    }

    public function getName(): string
    {
        return 'image';
    }

    public function serialize(Image $image, array $options = []): array
    {
        return [
            'url' => $image->getUrl(),
        ];
    }

    public function deserialize(array $data, Image $image, array $options = []): Image
    {
        $this->sipe('url', 'setUrl', $data, $image);

        return $image;
    }
}
