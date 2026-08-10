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
 * Refreshes the features widget ("landing-features") copy to the C-13 方案 B
 * 精简文案 (design/landing/features-b.html).
 *
 * The C-8 updater (15.0.100) seeded the previous features copy ("三大块，一个
 * 平台" + long cards). Environments already installed keep that data, so this
 * updater locates every `landing-features` widget instance and overwrites its
 * parameters with the new bilingual copy:
 *
 *   title    「平台特色」/ "Platform Features"
 *   subtitle 「三大能力，一个平台」/ "Three capabilities, one platform"
 *   cards    3 张精简卡 (icon / title / desc / href / tone), zh + en
 *   display  深青 (白字 / 深青底, 与 hero 容器一致; 渐变由 CSS 承担, D6)
 *
 * The operation is idempotent: when the stored title is already the new value
 * the instance is left untouched. Only the features widget is modified — the
 * other 4 landing widgets are never touched.
 */
class Updater150101 extends Updater
{
    /**
     * The widget name handled by this updater.
     */
    private const WIDGET_NAME = 'landing-features';

    /**
     * The new section title (idempotency marker).
     */
    private const NEW_TITLE = '平台特色';

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

            // idempotent: skip instances already carrying the C-13 copy
            if (self::NEW_TITLE === ($parameters['title'] ?? null)) {
                $this->logger?->info(sprintf('Features widget instance #%s already updated, skipping.', $instance->getId()));

                continue;
            }

            $config->setParameters($this->getNewParameters());
            $this->om->persist($config);

            $this->updateContainerDisplay($instance);

            $this->logger?->info(sprintf('Features widget instance #%s parameters updated (C-13 方案 B copy).', $instance->getId()));
        }

        $this->om->flush();
    }

    /**
     * Sets the widget container display to the deep-teal poster (white text /
     * deep teal background, same as the hero container). The CSS gradient
     * itself is hardcoded in the stylesheet (D6), so a plain color value is
     * enough here.
     */
    private function updateContainerDisplay(WidgetInstance $instance): void
    {
        $container = $instance->getContainer();

        if (!$container) {
            return;
        }

        $config = $container->getWidgetContainerConfigs()[0] ?? null;

        if (!$config) {
            return;
        }

        $config->setColor('#ffffff');
        $config->setBackgroundType('color');
        $config->setBackground('#0f766e');

        $this->om->persist($config);
    }

    /**
     * The C-13 方案 B features copy (zh primary + complete `en` block).
     */
    private function getNewParameters(): array
    {
        return [
            'title' => '平台特色',
            'subtitle' => '三大能力，一个平台',
            // deep-teal gradient (spec §6 schema; rendered by the stylesheet, D6)
            'background' => 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)',
            'cards' => [
                [
                    'icon' => 'fa fa-fw fa-chalkboard-teacher',
                    'title' => '老师工具',
                    'desc' => '备课授课，AI 提效',
                    'href' => '#feature-1',
                    'tone' => 'normal',
                ],
                [
                    'icon' => 'fa fa-fw fa-graduation-cap',
                    'title' => '学习方法',
                    'desc' => 'AI 助教，因材施教',
                    'href' => '#feature-2',
                    'tone' => 'normal',
                ],
                [
                    'icon' => 'fa fa-fw fa-cubes',
                    'title' => 'AI 平台',
                    'desc' => '基座安全，开箱即用',
                    'href' => '#feature-3',
                    'tone' => 'soft',
                ],
            ],
            // complete English copy (rendered by the features component for en visitors)
            'en' => [
                'title' => 'Platform Features',
                'subtitle' => 'Three capabilities, one platform',
                'cards' => [
                    ['icon' => 'fa fa-fw fa-chalkboard-teacher', 'title' => 'For Teachers', 'desc' => 'Prep & teach, AI-boosted', 'href' => '#feature-1', 'tone' => 'normal'],
                    ['icon' => 'fa fa-fw fa-graduation-cap', 'title' => 'For Learners', 'desc' => 'AI tutor, teach to each', 'href' => '#feature-2', 'tone' => 'normal'],
                    ['icon' => 'fa fa-fw fa-cubes', 'title' => 'AI-Native', 'desc' => 'Safe AI core, out of the box', 'href' => '#feature-3', 'tone' => 'soft'],
                ],
            ],
        ];
    }
}
