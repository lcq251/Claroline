<?php

namespace Claroline\MindMeAiBundle\Tools;

use Claroline\MindMeAiBundle\Agent\Tool\AbstractClarolineTool;
use NeuronAI\Tools\PropertyType;
use NeuronAI\Tools\ToolProperty;

class GetUserProgressTool extends AbstractClarolineTool
{
    public function __construct()
    {
        parent::__construct('get_user_progress', '查询某课程/资源的学习进度与评分，回答"学习进度/成绩"问题时使用。');
    }

    protected function properties(): array
    {
        return [
            new ToolProperty('resourceUuid', PropertyType::STRING, '资源或课程的 uuid'),
        ];
    }

    public function __invoke(?string $resourceUuid = null): string
    {
        return json_encode(['status' => 'not_implemented', 'tool' => 'get_user_progress', 'resourceUuid' => $resourceUuid]);
    }
}
