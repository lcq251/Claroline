<?php

namespace Claroline\MindMeAiBundle\Tests\Unit\Neuron;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Neuron\NeuronAiFactory;
use Claroline\MindMeAiBundle\Security\SecretCipher;
use Doctrine\ORM\EntityRepository;
use NeuronAI\Providers\Deepseek\Deepseek;

class NeuronAiFactoryTest extends MockeryTestCase
{
    private $om;
    private $cipher;

    protected function setUp(): void
    {
        parent::setUp();

        $this->om = $this->mock(ObjectManager::class);
        $this->cipher = $this->mock(SecretCipher::class);
    }

    private function mockDefaultLesson(?AiLesson $lesson): void
    {
        $repo = $this->mock(EntityRepository::class);
        $repo->shouldReceive('findOneBy')->with(['isDefault' => true])->andReturn($lesson);

        $this->om->shouldReceive('getRepository')->with(AiLesson::class)->andReturn($repo);
    }

    public function testMakeProviderReturnsDeepseekWithDecryptedKeyAndModel(): void
    {
        $lesson = $this->mock(AiLesson::class);
        $lesson->shouldReceive('getApiKey')->andReturn('encrypted-key');
        $lesson->shouldReceive('getModelName')->andReturn('deepseek-chat');
        $this->mockDefaultLesson($lesson);

        $this->cipher->shouldReceive('decrypt')->with('encrypted-key')->andReturn('sk-test-key');

        $provider = (new NeuronAiFactory($this->om, $this->cipher))->makeProvider();

        $this->assertInstanceOf(Deepseek::class, $provider);

        $keyProp = new \ReflectionProperty(Deepseek::class, 'key');
        $keyProp->setAccessible(true);
        $this->assertSame('sk-test-key', $keyProp->getValue($provider));

        $modelProp = new \ReflectionProperty(Deepseek::class, 'model');
        $modelProp->setAccessible(true);
        $this->assertSame('deepseek-chat', $modelProp->getValue($provider));
    }

    public function testMakeProviderFallsBackToDefaultModelName(): void
    {
        $lesson = $this->mock(AiLesson::class);
        $lesson->shouldReceive('getApiKey')->andReturn('encrypted-key');
        $lesson->shouldReceive('getModelName')->andReturn(null);
        $this->mockDefaultLesson($lesson);

        $this->cipher->shouldReceive('decrypt')->with('encrypted-key')->andReturn('sk-test-key');

        $provider = (new NeuronAiFactory($this->om, $this->cipher))->makeProvider();

        $modelProp = new \ReflectionProperty(Deepseek::class, 'model');
        $modelProp->setAccessible(true);
        $this->assertSame('deepseek-chat', $modelProp->getValue($provider));
    }

    public function testMakeProviderThrowsWhenNoDefaultLesson(): void
    {
        $this->mockDefaultLesson(null);

        $this->expectException(\RuntimeException::class);
        (new NeuronAiFactory($this->om, $this->cipher))->makeProvider();
    }

    public function testMakeProviderThrowsWhenNoApiKey(): void
    {
        $lesson = $this->mock(AiLesson::class);
        $lesson->shouldReceive('getApiKey')->andReturn(null);
        $this->mockDefaultLesson($lesson);

        $this->expectException(\RuntimeException::class);
        (new NeuronAiFactory($this->om, $this->cipher))->makeProvider();
    }
}
