<?php

namespace Claroline\MindMeAiBundle\Tools;

use Claroline\MindMeAiBundle\Agent\Tool\AbstractClarolineTool;
use NeuronAI\Tools\PropertyType;
use NeuronAI\Tools\ToolProperty;

class GradeAssignmentTool extends AbstractClarolineTool
{
    public function __construct()
    {
        parent::__construct('grade_assignment', '批改/打分作业（写操作，需审批）。');
    }

    protected function properties(): array
    {
        return [
            new ToolProperty('resourceUuid', PropertyType::STRING, '作业资源的 uuid'),
            new ToolProperty('score', PropertyType::INTEGER, '评分'),
        ];
    }

    public function __invoke(?string $resourceUuid = null, ?int $score = null): string
    {
        return json_encode(['status' => 'not_implemented', 'tool' => 'grade_assignment', 'resourceUuid' => $resourceUuid, 'score' => $score]);
    }
}
