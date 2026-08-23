<?php

namespace Claroline\MindMeAiBundle\Neuron;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Security\SecretCipher;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\Deepseek\Deepseek;

/**
 * Builds the Neuron AI provider from the platform's default AiLesson resource.
 *
 * The AiLesson stores the API key encrypted at rest (SecretCipher); this
 * factory decrypts it and instantiates the Deepseek provider. The provider
 * model name comes from the AiLesson modelName field (fallback deepseek-chat).
 */
class NeuronAiFactory
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly SecretCipher $cipher,
    ) {
    }

    /**
     * @throws \RuntimeException when no default AiLesson (with a key) exists
     */
    public function makeProvider(): AIProviderInterface
    {
        $lesson = $this->om->getRepository(AiLesson::class)->findOneBy(['isDefault' => true]);

        if (!$lesson || !$lesson->getApiKey()) {
            throw new \RuntimeException('No default AiLesson with apiKey configured.');
        }

        $key = $this->cipher->decrypt($lesson->getApiKey());
        $model = $lesson->getModelName() ?: 'deepseek-chat';

        return new Deepseek($key, $model);
    }
}
