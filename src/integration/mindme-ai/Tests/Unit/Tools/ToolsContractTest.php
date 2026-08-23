<?php

namespace Claroline\MindMeAiBundle\Tests\Unit\Tools;

use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\MindMeAiBundle\Agent\Tool\AbstractClarolineTool;
use Claroline\MindMeAiBundle\Tools\CreateResourceTool;
use Claroline\MindMeAiBundle\Tools\GetResourceContentTool;
use Claroline\MindMeAiBundle\Tools\GetUserProgressTool;
use Claroline\MindMeAiBundle\Tools\GradeAssignmentTool;
use Claroline\MindMeAiBundle\Tools\ListCoursesTool;
use Claroline\MindMeAiBundle\Tools\SearchResourcesTool;

class ToolsContractTest extends MockeryTestCase
{
    public function testAllToolsExposeTheExpectedContract(): void
    {
        $tools = [
            new ListCoursesTool(),
            new SearchResourcesTool(),
            new GetUserProgressTool(),
            new GetResourceContentTool(),
            new CreateResourceTool(),
            new GradeAssignmentTool(),
        ];

        $names = array_map(fn ($tool) => $tool->getName(), $tools);
        $this->assertSame([
            'list_courses',
            'search_resources',
            'get_user_progress',
            'get_resource_content',
            'create_resource',
            'grade_assignment',
        ], $names);

        foreach ($tools as $tool) {
            $this->assertInstanceOf(AbstractClarolineTool::class, $tool);
            $this->assertNotEmpty($tool->getDescription());
        }
    }

    public function testSearchResourcesToolDeclaresRequiredQueryProperty(): void
    {
        $tool = new SearchResourcesTool();

        $properties = $tool->getProperties();

        $this->assertCount(2, $properties);
        $this->assertSame('query', $properties[0]->getName());
        $this->assertTrue($properties[0]->isRequired());
    }

    public function testToolsExecuteAndReturnNotImplementedStub(): void
    {
        $result = (new ListCoursesTool())(5);

        $decoded = json_decode($result, true);
        $this->assertSame('not_implemented', $decoded['status']);
        $this->assertSame('list_courses', $decoded['tool']);
    }
}
