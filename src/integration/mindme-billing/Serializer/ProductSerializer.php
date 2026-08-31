<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\BillingBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CursusBundle\Entity\Course;
use Mindme\BillingBundle\Entity\Product;

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
 *   product.type          = targetType alias (for card tag/icon)
 *   product.title         = resolved target name (course name / resource name)
 *   product.url           = resolved target URL (or '#')
 */
class ProductSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

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
            // card fields (resolved target)
            'type' => $product->getTargetType(),
            'title' => $this->resolveTitle($product),
            'url' => $this->resolveUrl($product),
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

    private function resolveTitle(Product $product): ?string
    {
        if ('course' === $product->getTargetType()) {
            $course = $this->om->getRepository(Course::class)->find($product->getTargetId());

            return $course ? (string) $course->getName() : null;
        }

        $node = $this->om->getRepository(ResourceNode::class)->find($product->getTargetId());

        return $node ? (string) $node->getName() : null;
    }

    private function resolveUrl(Product $product): string
    {
        if ('course' === $product->getTargetType()) {
            $course = $this->om->getRepository(Course::class)->find($product->getTargetId());

            return $course ? '/desktop/trainings/course/'.$course->getSlug() : '#';
        }

        $node = $this->om->getRepository(ResourceNode::class)->find($product->getTargetId());
        if ($node && $node->getWorkspace()) {
            return '/desktop/workspaces/open/'.$node->getWorkspace()->getSlug().'/resources/'.$node->getSlug();
        }

        return '#';
    }
}