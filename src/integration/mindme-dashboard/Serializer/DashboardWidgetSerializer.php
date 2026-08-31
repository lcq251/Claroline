<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\DashboardBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Mindme\DashboardBundle\Entity\Widget\DashboardWidget;
use Mindme\DashboardBundle\Manager\DashboardStatsManager;

class DashboardWidgetSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly DashboardStatsManager $stats
    ) {
    }

    public function getClass(): string
    {
        return DashboardWidget::class;
    }

    public function getName(): string
    {
        return 'mindme_dashboard_widget';
    }

    public function serialize(DashboardWidget $widget, array $options = []): array
    {
        $params = $widget->getParameters() ?? [];
        $name = $widget->getWidgetInstance()?->getWidget()?->getName() ?? '';

        return match ($name) {
            'dashboard-workspace-tree' => $params + ['data' => [
                'tree' => $this->stats->getWorkspaceTree()['tree'] ?? [],
                'maxResources' => $this->stats->getWorkspaceTree()['maxResources'] ?? 5,
            ]],
            'dashboard-overview' => $params + ['data' => $this->stats->getOverviewData()],
            'dashboard-messages' => $params + ['data' => [
                'messages' => $this->stats->getMessages(4),
            ]],
            'dashboard-recommendations' => $params + ['data' => [
                'recommendations' => $this->stats->getRecommendations(4),
            ]],
            default => $params,
        };
    }

    public function deserialize($data, DashboardWidget $widget, array $options = []): DashboardWidget
    {
        $widget->setParameters($data);

        return $widget;
    }
}