<?php

namespace HeVinci\UrlBundle\Component\Resource;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\CoreBundle\Component\Resource\UrlAdapterInterface;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use HeVinci\UrlBundle\Entity\Url;

class UrlResource extends ResourceComponent implements UrlAdapterInterface
{
    public function __construct(
        private readonly SerializerProvider $serializer
    ) {
    }

    public static function getName(): string
    {
        return 'hevinci_url';
    }

    /** @param Url $resource */
    public function open(AbstractResource $resource, bool $embedded = false): ?array
    {
        return [
            'resource' => $this->serializer->serialize($resource),
        ];
    }

    public function update(AbstractResource $resource, array $data): ?array
    {
        return [
            'resource' => $this->serializer->serialize($resource),
        ];
    }

    public function supportsUrl(string $url): int
    {
        return UrlAdapterInterface::SUPPORTED_PARTIAL;
    }

    public function fromUrl(string $url): ?array
    {
        return [
            'name' => trim(str_replace(['http://', 'https://'], '', $url), '/'),
            'raw' => $url,
        ];
    }
}
