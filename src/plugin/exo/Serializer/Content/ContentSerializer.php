<?php

namespace UJM\ExoBundle\Serializer\Content;

use Claroline\AppBundle\API\Serializer\SerializerTrait;

/**
 * Serializer for contents.
 */
class ContentSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly ResourceContentSerializer $resourceContentSerializer
    ) {
    }

    public function getName(): string
    {
        return 'exo_content';
    }

    public function serialize(mixed $content, array $options = []): array
    {
        $node = $content->getResourceNode();

        if (!empty($node)) {
            $serialized = $this->resourceContentSerializer->serialize($node, $options);
        } else {
            $serialized = [
                'type' => 'text/html',
                'data' => $content->getData(),
            ];
        }

        return $serialized;
    }

    public function deserialize(array $data, mixed $content = null, array $options = []): mixed
    {
        if ('text/html' === $data['type'] || 'text/plain' === $data['type']) {
            // HTML is directly stored in the choice entity
            $content->setData($data['data']);
            $content->setResourceNode(null);
        } else {
            // Other types require a ResourceNode
            $node = $this->resourceContentSerializer->deserialize($content);

            $content->setData('');
            $content->setResourceNode($node);
        }

        return $content;
    }
}
