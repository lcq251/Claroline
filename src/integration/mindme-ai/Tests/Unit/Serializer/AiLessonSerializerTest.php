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

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Security\SecretCipher;
use Claroline\MindMeAiBundle\Serializer\AiLessonSerializer;
use Doctrine\ORM\EntityRepository;

class AiLessonSerializerTest extends MockeryTestCase
{
    private const SECRET = 'test-secret';

    private function createSerializer(array $otherDefaults = []): AiLessonSerializer
    {
        $om = $this->mock(ObjectManager::class);

        if (!empty($otherDefaults)) {
            $repo = $this->mock(EntityRepository::class);
            $repo->shouldReceive('findBy')->with(['isDefault' => true])->andReturn($otherDefaults);
            $om->shouldReceive('getRepository')->with(AiLesson::class)->andReturn($repo);
        }

        return new AiLessonSerializer($om, new SecretCipher(self::SECRET));
    }

    private function cipher(): SecretCipher
    {
        return new SecretCipher(self::SECRET);
    }

    public function testSerializeNeverExposesPlaintextKey(): void
    {
        $lesson = new AiLesson();
        $lesson->setModelName('qwen-max');
        $lesson->setApiKey($this->cipher()->encrypt('sk-plain-secret'));
        $lesson->setExpiresAt(new \DateTime('2026-12-31 23:59:59'));
        $lesson->setIsDefault(true);

        $data = $this->createSerializer()->serialize($lesson);

        $this->assertSame('qwen-max', $data['modelName']);
        $this->assertTrue($data['hasKey']);
        $this->assertSame(AiLessonSerializer::MASK, $data['apiKeyMask']);
        $this->assertSame('2026-12-31T23:59:59+00:00', $data['expiresAt']);
        $this->assertTrue($data['isDefault']);
        $this->assertArrayNotHasKey('apiKey', $data);
        $this->assertStringNotContainsString('sk-plain-secret', json_encode($data));
    }

    public function testSerializeEmptyKey(): void
    {
        $lesson = new AiLesson();

        $data = $this->createSerializer()->serialize($lesson);

        $this->assertFalse($data['hasKey']);
        $this->assertSame('', $data['apiKeyMask']);
        $this->assertNull($data['modelName']);
        $this->assertNull($data['expiresAt']);
    }

    public function testDeserializeEncryptsNewApiKey(): void
    {
        $lesson = new AiLesson();
        $lesson = $this->createSerializer()->deserialize(['apiKey' => 'sk-new-key'], $lesson);

        $this->assertNotSame('sk-new-key', $lesson->getApiKey());
        $this->assertStringNotContainsString('sk-new-key', (string) $lesson->getApiKey());
        $this->assertSame('sk-new-key', $this->cipher()->decrypt($lesson->getApiKey()));
    }

    public function testDeserializeMaskOrEmptyKeepsStoredKey(): void
    {
        $lesson = new AiLesson();
        $lesson->setApiKey($this->cipher()->encrypt('sk-kept'));

        $masked = $this->createSerializer()->deserialize(['apiKey' => AiLessonSerializer::MASK], $lesson);
        $this->assertSame($lesson->getApiKey(), $masked->getApiKey());

        $emptied = $this->createSerializer()->deserialize(['apiKey' => ''], $lesson);
        $this->assertSame($lesson->getApiKey(), $emptied->getApiKey());
    }

    public function testDeserializeSettingDefaultUnmarksOthers(): void
    {
        $other = new AiLesson();
        $other->setIsDefault(true);

        $lesson = new AiLesson();
        $lesson = $this->createSerializer([$other])->deserialize(['isDefault' => true], $lesson);

        $this->assertTrue($lesson->isDefault());
        $this->assertFalse($other->isDefault());
    }
}
