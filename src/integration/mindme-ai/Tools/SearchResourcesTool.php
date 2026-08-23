<?php

namespace Claroline\MindMeAiBundle\Tools;

use Claroline\MindMeAiBundle\Agent\Tool\AbstractClarolineTool;
use NeuronAI\Tools\PropertyType;
use NeuronAI\Tools\ToolProperty;

class SearchResourcesTool extends AbstractClarolineTool
{
    public function __construct()
    {
        parent::__construct('search_resources', '按关键字搜索平台上的资源，回答"找资料/找资源"问题时使用。');
    }

    protected function properties(): array
    {
        return [
            new ToolProperty('query', PropertyType::STRING, '搜索关键字', true),
            new ToolProperty('limit', PropertyType::INTEGER, '最大返回条数，默认 10'),
        ];
    }

    public function __invoke(string $query, ?int $limit = null): string
    {
        return json_encode(['status' => 'not_implemented', 'tool' => 'search_resources', 'query' => $query, 'limit' => $limit]);
    }
}
