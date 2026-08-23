<?php

namespace Claroline\MindMeAiBundle\Tools;

use Claroline\MindMeAiBundle\Agent\Tool\AbstractClarolineTool;
use NeuronAI\Tools\PropertyType;
use NeuronAI\Tools\ToolProperty;

class GetResourceContentTool extends AbstractClarolineTool
{
    public function __construct()
    {
        parent::__construct('get_resource_content', '读取某资源的正文内容，回答"这篇内容讲了什么"时使用。');
    }

    protected function properties(): array
    {
        return [
            new ToolProperty('resourceUuid', PropertyType::STRING, '资源的 uuid', true),
        ];
    }

    public function __invoke(string $resourceUuid): string
    {
        return json_encode(['status' => 'not_implemented', 'tool' => 'get_resource_content', 'resourceUuid' => $resourceUuid]);
    }
}
