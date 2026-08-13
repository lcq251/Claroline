<?php

namespace Claroline\MindMeAiBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\MindMeAiBundle\Entity\Resource\ResourceReference;

/**
 * Serializes a resource input reference.
 *
 * The target is serialized in MINIMAL mode (lightweight ResourceNode data —
 * the "input as configuration parameter" semantics, D7): the frontend only
 * needs name/type/id to display and route to the input resource.
 *
 * A dangling reference (target resource deleted) serializes target to null —
 * the frontend displays "resource deleted" instead of crashing.
 */
class ResourceReferenceSerializer
{
    use SerializerTrait;

    public function __construct(private readonly ResourceNodeSerializer $resourceNodeSerializer)
    {
    }

    public function getName(): string
    {
        return 'resource_reference';
    }

    public function serialize(ResourceReference $reference, array $options = []): array
    {
        $target = null;
        if ($reference->getTarget()) {
            $target = $this->resourceNodeSerializer->serialize(
                $reference->getTarget(),
                array_merge($options, [Options::SERIALIZE_MINIMAL])
            );
        }

        return [
            'id' => $reference->getUuid(),
            'order' => $reference->getOrder(),
            'target' => $target, // null = target resource deleted (dangling reference)
        ];
    }
}
