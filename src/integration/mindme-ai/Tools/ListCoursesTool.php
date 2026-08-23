<?php

namespace Claroline\MindMeAiBundle\Tools;

use Claroline\MindMeAiBundle\Agent\Tool\AbstractClarolineTool;
use NeuronAI\Tools\PropertyType;
use NeuronAI\Tools\ToolProperty;

class ListCoursesTool extends AbstractClarolineTool
{
    public function __construct()
    {
        parent::__construct('list_courses', '列出当前用户注册的课程，回答课程/选课问题时使用。');
    }

    protected function properties(): array
    {
        return [
            new ToolProperty('limit', PropertyType::INTEGER, '最大返回条数，默认 10'),
        ];
    }

    public function __invoke(int $limit = 10): string
    {
        return json_encode(['status' => 'not_implemented', 'tool' => 'list_courses', 'limit' => $limit]);
    }
}
