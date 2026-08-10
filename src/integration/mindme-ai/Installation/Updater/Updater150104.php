<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\InstallationBundle\Updater\Updater;
use Claroline\MindMeAiBundle\Entity\Widget\LandingWidget;

/**
 * Refreshes the hero widget ("landing-hero") background to the C-16 方案 A
 * light-teal wash: `linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)`
 * (top teal fading to white, 上青下白渐变).
 *
 * The C-14 updater (15.0.102) had painted the hero background with the white
 * gradient (`#ffffff → #f8fafc`) which left the whole landing page almost
 * pure white, with no separation between the hero and the features section.
 * Environments already installed keep that value, so this updater locates
 * every `landing-hero` widget instance and overwrites only the `background`
 * parameter (read-modify-write) — the topline / stamp / en blocks and any
 * admin edits are preserved.
 *
 * The operation is idempotent: the C-16 gradient carries a `#f0fdfa` color
 * stop, so instances whose stored background already contains `#f0fdfa` are
 * left untouched. Only the hero widget is modified — the features / packaging
 * / ai / cta instances are never touched (their background slots are rendered
 * by the stylesheet, D6).
 */
class Updater150104 extends Updater
{
    /**
     * The widget name handled by this updater.
     */
    private const WIDGET_NAME = 'landing-hero';

    /**
     * The C-16 方案 A hero background (上青下白渐变, D1 用户拍板).
     */
    private const NEW_BACKGROUND = 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)';

    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    public function postUpdate(): void
    {
        $widget = $this->om
            ->getRepository(Widget::class)
            ->findOneBy(['name' => self::WIDGET_NAME]);

        if (!$widget) {
            $this->logger?->info(sprintf('Landing widget "%s" not registered, skipping.', self::WIDGET_NAME));

            return;
        }

        $instances = $this->om
            ->getRepository(WidgetInstance::class)
            ->findBy(['widget' => $widget]);

        if (0 === count($instances)) {
            $this->logger?->info(sprintf('No instance of landing widget "%s", skipping.', self::WIDGET_NAME));

            return;
        }

        foreach ($instances as $instance) {
            $config = $this->om
                ->getRepository(LandingWidget::class)
                ->findOneBy(['widgetInstance' => $instance]);

            if (!$config) {
                continue;
            }

            $parameters = $config->getParameters() ?? [];

            // idempotent: the C-16 gradient already carries the light-teal stop
            if (str_contains($parameters['background'] ?? '', '#f0fdfa')) {
                $this->logger?->info(sprintf('Hero widget instance #%s already updated, skipping.', $instance->getId()));

                continue;
            }

            // read-modify-write: only the background key is overwritten so the
            // topline / stamp / en blocks (and any admin edits) are preserved
            $parameters['background'] = self::NEW_BACKGROUND;
            $config->setParameters($parameters);
            $this->om->persist($config);

            $this->logger?->info(sprintf('Hero widget instance #%s background refreshed (C-16 上青下白渐变).', $instance->getId()));
        }

        $this->om->flush();
    }
}
