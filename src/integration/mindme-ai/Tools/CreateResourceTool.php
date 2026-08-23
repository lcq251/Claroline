<?php

namespace Claroline\MindMeAiBundle\Tools;

use Claroline\MindMeAiBundle\Agent\Tool\AbstractClarolineTool;
use NeuronAI\Tools\PropertyType;
use NeuronAI\Tools\ToolProperty;

class CreateResourceTool extends AbstractClarolineTool
{
    public function __construct()
    {
        parent::__construct('create_resource', '在指定目录下创建资源（写操作，需审批）。');
    }

    protected function properties(): array
    {
        return [
            new ToolProperty('parentUuid', PropertyType::STRING, '父目录的 uuid'),
            new ToolProperty('type', PropertyType::STRING, '资源类型'),
            new ToolProperty('name', PropertyType::STRING, '资源名称'),
        ];
    }

    public function __invoke(?string $parentUuid = null, ?string $type = null, ?string $name = null): string
    {
        return json_encode(['status' => 'not_implemented', 'tool' => 'create_resource', 'parentUuid' => $parentUuid, 'type' => $type, 'name' => $name]);
    }
}
