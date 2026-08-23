<?php

namespace Claroline\MindMeAiBundle\Tests\Unit\Agent;

use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\MindMeAiBundle\Agent\TeachingAgent;
use Claroline\MindMeAiBundle\Neuron\NeuronAiFactory;
use Claroline\MindMeAiBundle\Tools\CreateResourceTool;
use Claroline\MindMeAiBundle\Tools\GetResourceContentTool;
use Claroline\MindMeAiBundle\Tools\GetUserProgressTool;
use Claroline\MindMeAiBundle\Tools\GradeAssignmentTool;
use Claroline\MindMeAiBundle\Tools\ListCoursesTool;
use Claroline\MindMeAiBundle\Tools\SearchResourcesTool;

class TeachingAgentTest extends MockeryTestCase
{
    public function testToolsReturnsTheInjectedToolSet(): void
    {
        $factory = $this->mock(NeuronAiFactory::class);

        $tools = [
            new ListCoursesTool(),
            new SearchResourcesTool(),
            new GetUserProgressTool(),
            new GetResourceContentTool(),
            new CreateResourceTool(),
            new GradeAssignmentTool(),
        ];

        $agent = new TeachingAgent($factory, $tools);

        $method = new \ReflectionMethod(TeachingAgent::class, 'tools');
        $method->setAccessible(true);
        $result = $method->invoke($agent);

        $this->assertCount(6, $result);

        $names = array_map(fn ($tool) => $tool->getName(), $result);
        $this->assertSame([
            'list_courses',
            'search_resources',
            'get_user_progress',
            'get_resource_content',
            'create_resource',
            'grade_assignment',
        ], $names);
    }
}
