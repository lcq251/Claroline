<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\MdhomeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Mindme\MdhomeBundle\Entity\Widget\LandingWidget;

class LandingWidgetSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return LandingWidget::class;
    }

    public function getName(): string
    {
        return 'mindme_landing_widget';
    }

    public function serialize(LandingWidget $widget, array $options = []): array
    {
        return [
            'parameters' => $widget->getParameters() ?? [],
        ];
    }

    public function deserialize($data, LandingWidget $widget, array $options = []): LandingWidget
    {
        $this->sipe('parameters', 'setParameters', $data, $widget);

        return $widget;
    }
}