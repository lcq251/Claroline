<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\MindMeAiBundle\Entity\Widget\LandingWidget;
use Claroline\MindMeAiBundle\Manager\DashboardStatsManager;

/**
 * Serializes the JSON configuration of the mindme-ai widgets
 * (landing page + desktop dashboard, C-22).
 *
 * It is the only serializer claiming the LandingWidget entity (the previous
 * LandingWidgetSerializer has been absorbed here): SerializerProvider::get()
 * matches on the entity class, so both `landing-*` and `dashboard-*` widget
 * instances are dispatched by this class based on the widget name.
 *
 * Dispatch (spec dashboard-design §9.2):
 *   - dashboard-board          -> parameters + data{greeting, stats}   (role stats)
 *   - dashboard-notifications  -> parameters + data{messages}
 *   - dashboard-fees           -> parameters + data{fees, income}
 *   - dashboard-recommendations/ -shortcuts -> parameters only (admin-configured)
 *   - landing-*                -> parameters as-is (previous behavior)
 */
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
            // recommendations / shortcuts: admin-configured items only
            // landing-*: pass-through (previous LandingWidgetSerializer behavior)
            default => $params,
        };
    }

    public function deserialize($data, LandingWidget $widget, array $options = []): LandingWidget
    {
        $widget->setParameters($data);

        return $widget;
    }
}
