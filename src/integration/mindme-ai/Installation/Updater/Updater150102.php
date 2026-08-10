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
 * Refreshes the landing widgets to the C-14 浅色系 copy (design/landing, light
 * theme): the hero switches from the deep-teal poster to a white gradient with
 * a top-left narrative and a top-right S1 seal; the features cards move to the
 * DIY 三卡 copy on a light wash background; the packaging section drops its
 * "Packaging" kicker (component change) and gets the new title/subtitle.
 *
 * The C-8 updater (15.0.100) seeded the hero/features/packaging instances and
 * C-13 (15.0.101) refreshed the features copy. Environments already installed
 * keep that data, so this updater locates every instance of the three landing
 * widgets and overwrites its parameters with the new bilingual copy:
 *
 *   hero       topline 「2026有人称之为元年，学习将由此而变」+ white gradient
 *              background + year/brand cleared + S1 stamp {enabled, text}
 *   features   title/subtitle preserved, DIY 三卡 (fa-tools / fa-robot /
 *              fa-lightbulb), light wash background, container display light
 *   packaging  title 「一处编译，多端访问」+ subtitle 「一套代码，多端运行」,
 *              platforms preserved, en block synchronized
 *
 * The operation is idempotent: each widget is left untouched when its
 * idempotency marker already matches (hero: `topline` set; features:
 * cards[0].title === 'DIY工具'; packaging: title === '一处编译，多端访问').
 * Only the three landing widgets are modified — ai / cta are never touched.
 */
class Updater150102 extends Updater
{
    /**
     * The hero white-gradient background (D2, 自上而下白色渐变).
     */
    private const HERO_BACKGROUND = 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)';

    /**
     * The features light-wash background (D4, 浅青水洗底).
     */
    private const FEATURES_BACKGROUND = 'linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)';

    /**
     * The hero narrative shown top-left (D1, 用户拍板).
     */
    private const HERO_TOP_LINE = '2026有人称之为元年，学习将由此而变';

    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    public function postUpdate(): void
    {
        $this->updateWidget('landing-hero', 'topline', $this->getHeroParameters(...));
        $this->updateWidget('landing-features', 'cards.0.title', $this->getFeaturesParameters(...));
        $this->updateWidget('landing-packaging', 'title', $this->getPackagingParameters(...));
    }

    /**
     * Refreshes every instance of a landing widget whose idempotency marker is
     * not yet set. The marker follows the `path` selector (dot notation into
     * the parameters array); when the expected value is present the instance is
     * left untouched.
     */
    private function updateWidget(string $widgetName, string $markerPath, callable $getNewParameters): void
    {
        $widget = $this->om
            ->getRepository(Widget::class)
            ->findOneBy(['name' => $widgetName]);

        if (!$widget) {
            $this->logger?->info(sprintf('Landing widget "%s" not registered, skipping.', $widgetName));

            return;
        }

        $instances = $this->om
            ->getRepository(WidgetInstance::class)
            ->findBy(['widget' => $widget]);

        if (0 === count($instances)) {
            $this->logger?->info(sprintf('No instance of landing widget "%s", skipping.', $widgetName));

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

            // idempotent: skip instances already carrying the C-14 copy
            if ($this->readMarker($parameters, $markerPath)) {
                $this->logger?->info(sprintf('Landing widget "%s" instance #%s already updated, skipping.', $widgetName, $instance->getId()));

                continue;
            }

            $config->setParameters($getNewParameters($parameters));
            $this->om->persist($config);

            if ('landing-features' === $widgetName) {
                $this->updateContainerDisplay($instance);
            }

            $this->logger?->info(sprintf('Landing widget "%s" instance #%s parameters updated (C-14 浅色系 copy).', $widgetName, $instance->getId()));
        }

        $this->om->flush();
    }

    /**
     * Reads an idempotency marker from the parameters. `cards.0.title` style
     * selectors are resolved through dot notation.
     */
    private function readMarker(array $parameters, string $path): bool
    {
        $segments = explode('.', $path);
        $value = $parameters;

        foreach ($segments as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return false;
            }

            $value = $value[$segment];
        }

        if ('title' === $segments[count($segments) - 1]) {
            // string markers: the value must match the frozen copy
            return 'DIY工具' === $value || '一处编译，多端访问' === $value;
        }

        // presence marker (hero topline)
        return !empty($value);
    }

    /**
     * Sets the features widget container display to the light wash (dark text /
     * light background). The C-13 updater had painted it deep teal (#0f766e);
     * keeping that would stack a dark container behind the light section.
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

        $config->setColor('#0f172a');
        $config->setBackgroundType('color');
        $config->setBackground('#f0fdfa');

        $this->om->persist($config);
    }

    /**
     * The C-14 hero copy: existing title / subtitle / cta are preserved, the
     * background becomes a white gradient and the topbar switches to topline
     * (left) + S1 seal (right); year / brand are cleared (the seal carries the
     * brand, D1). The `stamp` parameter enables the seal rendering; when it is
     * missing or disabled the component falls back to the year stamp (legacy
     * compat).
     */
    private function getHeroParameters(array $current): array
    {
        return [
            'title' => $current['title'] ?? 'AI = 协同 + 伙伴',
            'subtitle' => $current['subtitle'] ?? '用AI学AI，让学习多一点DIY',
            'cta' => $current['cta'] ?? [
                'label' => '登录 / 注册',
                'href' => '/login',
            ],
            'topline' => self::HERO_TOP_LINE,
            'background' => self::HERO_BACKGROUND,
            'brand' => '',
            'year' => '',
            'stamp' => [
                'enabled' => true,
                'text' => '澜之轩',
            ],
            'en' => [
                'title' => 'AI = Collaboration + Companion',
                'subtitle' => 'Learn AI with AI — make learning more DIY',
                'cta' => [
                    'label' => 'Sign In / Register',
                    'href' => '/login',
                ],
                'topline' => '2026 — the year AI took off',
                'brand' => '',
                'year' => '',
                'stamp' => [
                    'enabled' => true,
                    'text' => '澜之轩',
                ],
            ],
        ];
    }

    /**
     * The C-14 features copy: title / subtitle are preserved, the background
     * slot moves to the light wash and the cards become the DIY 三卡
     * (D5/D8: fa-tools / fa-robot / fa-lightbulb, 第 3 卡 tone = soft).
     */
    private function getFeaturesParameters(array $current): array
    {
        return [
            'title' => $current['title'] ?? '平台特色',
            'subtitle' => $current['subtitle'] ?? '三大能力，一个平台',
            'background' => self::FEATURES_BACKGROUND,
            'cards' => [
                [
                    'icon' => 'fa fa-fw fa-tools',
                    'title' => 'DIY工具',
                    'desc' => '自制工具，动手学习',
                    'href' => '#feature-1',
                    'tone' => 'normal',
                ],
                [
                    'icon' => 'fa fa-fw fa-robot',
                    'title' => 'AI助学·个性定制',
                    'desc' => 'AI 助教，学情适配',
                    'href' => '#feature-2',
                    'tone' => 'normal',
                ],
                [
                    'icon' => 'fa fa-fw fa-lightbulb',
                    'title' => 'Idea展示',
                    'desc' => '创意激发，作品分享',
                    'href' => '#feature-3',
                    'tone' => 'soft',
                ],
            ],
            // complete English copy (rendered by the features component for en visitors)
            'en' => [
                'title' => 'Platform Features',
                'subtitle' => 'Three capabilities, one platform',
                'cards' => [
                    ['icon' => 'fa fa-fw fa-tools', 'title' => 'DIY Tools', 'desc' => 'Build your own tools, learn by doing', 'href' => '#feature-1', 'tone' => 'normal'],
                    ['icon' => 'fa fa-fw fa-robot', 'title' => 'AI Tutoring, Personalized', 'desc' => 'AI tutor, adapts to your learning', 'href' => '#feature-2', 'tone' => 'normal'],
                    ['icon' => 'fa fa-fw fa-lightbulb', 'title' => 'Idea Showcase', 'desc' => 'Spark ideas, share your work', 'href' => '#feature-3', 'tone' => 'soft'],
                ],
            ],
        ];
    }

    /**
     * The C-14 packaging copy: new title / subtitle (D7), the existing
     * platforms (zh + en) are preserved so admins keep their custom cards.
     */
    private function getPackagingParameters(array $current): array
    {
        return [
            'title' => '一处编译，多端访问',
            'subtitle' => '一套代码，多端运行',
            'platforms' => $current['platforms'] ?? [
                ['icon' => 'mini', 'name' => '小程序', 'desc' => '轻量即用，随时学习'],
                ['icon' => 'desktop', 'name' => '桌面', 'desc' => '完整功能，高效教学'],
                ['icon' => 'app', 'name' => '应用', 'desc' => '移动端随行，处处可学'],
            ],
            'en' => [
                'title' => 'Build once, run everywhere',
                'subtitle' => 'One codebase, every device',
                'platforms' => $current['en']['platforms'] ?? [
                    ['icon' => 'mini', 'name' => 'Mini program', 'desc' => 'Lightweight, learn anytime'],
                    ['icon' => 'desktop', 'name' => 'Desktop', 'desc' => 'Full features, efficient teaching'],
                    ['icon' => 'app', 'name' => 'Mobile app', 'desc' => 'On the go, learn anywhere'],
                ],
            ],
        ];
    }
}
