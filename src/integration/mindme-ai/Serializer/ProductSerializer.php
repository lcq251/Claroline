<?php

namespace Claroline\MindMeAiBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\MindMeAiBundle\Entity\Product;

/**
 * Serializes the Product entity for API consumption.
 *
 * Output contract:
 *   product.code          = product code (string, unique)
 *   product.targetType    = 'resource' or 'course'
 *   product.targetId      = target entity ID (int)
 *   product.price         = price value (float | null)
 *   product.description   = product description (text | null)
 *   product.status        = 'approved' (string)
 *   product.creator       = creator user uuid
 *   product.createdAt     = creation timestamp (ISO 8601)
 *   product.updatedAt     = update timestamp (ISO 8601)
 */
class ProductSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return Product::class;
    }

    public function getName(): string
    {
        return 'product';
    }

    public function serialize(Product $product, array $options = []): array
    {
        return [
            'id' => $product->getUuid(),
            'code' => $product->getCode(),
            'targetType' => $product->getTargetType(),
            'targetId' => $product->getTargetId(),
            'price' => $product->getPrice(),
            'description' => $product->getDescription(),
            'status' => $product->getStatus(),
            'creator' => $product->getCreator() ? $product->getCreator()->getUuid() : null,
            'createdAt' => $product->getCreatedAt()->format(\DateTimeImmutable::ATOM),
            'updatedAt' => $product->getUpdatedAt()->format(\DateTimeImmutable::ATOM),
        ];
    }

    public function deserialize(array $data, Product $product, array $options = []): Product
    {
        $this->sipe('code', 'setCode', $data, $product);
        $this->sipe('targetType', 'setTargetType', $data, $product);
        $this->sipe('targetId', 'setTargetId', $data, $product);
        $this->sipe('price', 'setPrice', $data, $product);
        $this->sipe('description', 'setDescription', $data, $product);
        $this->sipe('status', 'setStatus', $data, $product);

        return $product;
    }
}
