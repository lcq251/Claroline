<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Tests\Unit\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\MindMeAiBundle\Entity\Resource\ResourceReference;
use Claroline\MindMeAiBundle\Serializer\ResourceReferenceSerializer;

class ResourceReferenceSerializerTest extends MockeryTestCase
{
    private function createSerializer(): ResourceReferenceSerializer
    {
        $nodeSerializer = $this->mock(ResourceNodeSerializer::class);

        return new ResourceReferenceSerializer($nodeSerializer);
    }

    public function testSerializeWithTargetOutputsMinimalTarget(): void
    {
        $target = new ResourceNode();
        $host = new ResourceNode();

        $nodeSerializer = $this->mock(ResourceNodeSerializer::class);
        $nodeSerializer->shouldReceive('serialize')
            ->with($target, \Mockery::on(function (array $options) {
                return in_array(Options::SERIALIZE_MINIMAL, $options);
            }))
            ->andReturn([
                'id' => 'target-uuid',
                'name' => 'My Ai Lesson',
                'meta' => ['type' => 'ai_lesson'],
            ]);

        $reference = new ResourceReference();
        $reference->setHost($host);
        $reference->setTarget($target);
        $reference->setOrder(2);

        $data = (new ResourceReferenceSerializer($nodeSerializer))->serialize($reference);

        $this->assertSame($reference->getUuid(), $data['id']);
        $this->assertSame(2, $data['order']);
        $this->assertSame('target-uuid', $data['target']['id']);
        $this->assertSame('My Ai Lesson', $data['target']['name']);
        $this->assertSame('ai_lesson', $data['target']['meta']['type']);
    }

    public function testSerializeWithNullTargetOutputsNull(): void
    {
        $host = new ResourceNode();
        $nodeSerializer = $this->mock(ResourceNodeSerializer::class);
        $nodeSerializer->shouldReceive('serialize')->never();

        $reference = new ResourceReference();
        $reference->setHost($host);
        $reference->setOrder(0);

        $data = (new ResourceReferenceSerializer($nodeSerializer))->serialize($reference);

        $this->assertSame($reference->getUuid(), $data['id']);
        $this->assertSame(0, $data['order']);
        $this->assertNull($data['target']);
    }

    public function testGetName(): void
    {
        $this->assertSame('resource_reference', $this->createSerializer()->getName());
    }
}
