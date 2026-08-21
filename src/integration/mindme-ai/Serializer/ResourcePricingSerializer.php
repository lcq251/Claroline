<?php

namespace Claroline\MindMeAiBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\MindMeAiBundle\Entity\ResourcePricing;

/**
 * Serializes the independent ResourcePricing structure (pricing dimension).
 *
 * Output contract (mirrors course pricing semantics):
 *   pricing.price         = price value (float | null)
 *   pricing.currency      = ISO 4217 code (default CNY)
 *   pricing.description   = pricing description (text | null)
 */
class ResourcePricingSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return ResourcePricing::class;
    }

    public function getName(): string
    {
        return 'resource_pricing';
    }

    public function serialize(ResourcePricing $entity, array $options = []): array
    {
        return [
            'id' => $entity->getUuid(),
            'resourceNode' => $entity->getResourceNode() ? $entity->getResourceNode()->getUuid() : null,
            'pricing' => [
                'price' => $entity->getPrice(),
                'currency' => $entity->getCurrency(),
                'description' => $entity->getDescription(),
            ],
        ];
    }

    public function deserialize(array $data, ResourcePricing $entity, array $options = []): ResourcePricing
    {
        if (isset($data['pricing'])) {
            $this->sipe('pricing.price', 'setPrice', $data, $entity);
            $this->sipe('pricing.currency', 'setCurrency', $data, $entity);
            $this->sipe('pricing.description', 'setDescription', $data, $entity);
        }

        return $entity;
    }
}