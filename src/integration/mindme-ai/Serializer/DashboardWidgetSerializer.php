<?php

namespace Claroline\MindMeAiBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\MindMeAiBundle\Entity\Widget\DashboardWidget;

class DashboardWidgetSerializer
{
    use SerializerTrait;

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
        return [];
    }

    public function deserialize($data, DashboardWidget $widget, array $options = []): DashboardWidget
    {
        return $widget;
    }
}
