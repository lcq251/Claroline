<?php

namespace Claroline\MindMeAiBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\MindMeAiBundle\Entity\Widget\LandingWidget;
use Claroline\MindMeAiBundle\Manager\DashboardStatsManager;

class DashboardWidgetSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly DashboardStatsManager $stats
    ) {
    }

    public function getClass(): string
    {
        return LandingWidget::class;
    }

    public function getName(): string
    {
        return 'mindme_dashboard_widget';
    }

    public function serialize(LandingWidget $widget, array $options = []): array
    {
        $params = $widget->getParameters() ?? [];
        $name = $widget->getWidgetInstance()?->getWidget()?->getName() ?? '';

        return match ($name) {
            'dashboard-board' => $params + ['data' => $this->stats->getBoardData()],
            'dashboard-notifications' => $params + ['data' => [
                'messages' => $this->stats->getMessages($params['maxItems'] ?? 3),
            ]],
            'dashboard-fees' => $params + ['data' => [
                'fees' => $this->stats->getFees($params['maxItems'] ?? 3),
                'income' => $this->stats->getIncome(),
            ]],
            'dashboard-workspace-tree' => $params + ['data' => $this->stats->getWorkspaceTree()],
            default => $params,
        };
    }

    public function deserialize($data, LandingWidget $widget, array $options = []): LandingWidget
    {
        $widget->setParameters($data);
        return $widget;
    }
}