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

/**
 * Serializes the JSON configuration of the landing page widgets.
 *
 * The config document is stored as-is: the React components read the exact
 * `parameters` shape (title, subtitle, story, cards, items, platforms,
 * buttons, stamp...), so no mapping is required here.
 */
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
        return $widget->getParameters() ?? [];
    }

    public function deserialize($data, LandingWidget $widget, array $options = []): LandingWidget
    {
        $widget->setParameters($data);

        return $widget;
    }
}
