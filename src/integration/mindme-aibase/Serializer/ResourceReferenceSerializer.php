<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Mindme\AibaseBundle\Entity\Resource\ResourceReference;

/**
 * Serializes a resource input reference.
 *
 * The target is serialized in MINIMAL mode (lightweight ResourceNode data),
 * so the frontend only needs name/type/id to display and route. A dangling
 * reference (target resource deleted) serializes target to null.
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