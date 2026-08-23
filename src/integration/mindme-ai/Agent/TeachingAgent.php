<?php

namespace Claroline\MindMeAiBundle\Agent;

use Claroline\MindMeAiBundle\Neuron\NeuronAiFactory;
use NeuronAI\Agent\Agent;
use NeuronAI\Agent\SystemPrompt;
use NeuronAI\Providers\AIProviderInterface;

/**
 * The AI teaching assistant agent.
 *
 * The provider is built by NeuronAiFactory (default AiLesson resource), and
 * the tool set is injected via the constructor. instructions()/provider()/
 * tools() are the Neuron extension points.
 */
class TeachingAgent extends Agent
{
    /**
     * @param array<\NeuronAI\Tools\ToolInterface> $tools
     */
    public function __construct(
        private readonly NeuronAiFactory $factory,
        private readonly array $injectedTools = [],
    ) {
        parent::__construct();
    }

    protected function provider(): AIProviderInterface
    {
        return $this->factory->makeProvider();
    }

    protected function instructions(): string
    {
        return (string) new SystemPrompt(
            background: [
                'You are an AI teaching assistant inside an LMS (Claroline).',
                'Use the tools available to fetch real course/resource/progress data before answering.',
                'Answer in the language the student uses.',
            ]
        );
    }

    protected function tools(): array
    {
        return $this->injectedTools;
    }
}
