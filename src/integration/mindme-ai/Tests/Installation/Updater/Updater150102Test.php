<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Tests\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\PublicContext;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetContainer;
use Claroline\CoreBundle\Entity\Widget\WidgetContainerConfig;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\MindMeAiBundle\Entity\Widget\LandingWidget;
use Claroline\MindMeAiBundle\Installation\Updater\Updater150102;

class Updater150102Test extends TransactionalTestCase
{
    private function getOm(): ObjectManager
    {
        return $this->client->getContainer()->get(ObjectManager::class);
    }

    private function getUpdater(): Updater150102
    {
        return new Updater150102($this->getOm());
    }

    /**
     * Seeds a landing widget (definition + container + parameter row) with the
     * given parameters, mirroring what the previous updaters (15.0.100 / 15.0.101)
     * leave behind on an already-installed environment.
     */
    private function seedLandingInstance(string $widgetName, string $containerName, array $parameters): void
    {
        $om = $this->getOm();

        $widget = new Widget();
        $widget->setName($widgetName);
        $widget->setClass(LandingWidget::class);
        $widget->setContext([PublicContext::getName()]);
        $widget->setSources([]);
        $widget->setTags(['content']);
        $widget->setExportable(false);
        $om->persist($widget);

        $container = new WidgetContainer();
        $om->persist($container);

        $instance = new WidgetInstance();
        $instance->setWidget($widget);
        $instance->setContainer($container);
        $om->persist($instance);

        $containerConfig = new WidgetContainerConfig();
        $containerConfig->setWidgetContainer($container);
        $containerConfig->setName($containerName);
        $containerConfig->setVisible(true);
        $containerConfig->setLayout([1]);
        $containerConfig->setColor('#0f172a');
        $containerConfig->setBackgroundType('color');
        $containerConfig->setBackground('#f8fafc');
        $om->persist($containerConfig);

        $landingWidget = new LandingWidget();
        $landingWidget->setWidgetInstance($instance);
        $landingWidget->setParameters($parameters);
        $om->persist($landingWidget);

        $om->flush();
    }

    private function getLandingParameters(string $widgetName): ?array
    {
        $om = $this->getOm();

        $widget = $om->getRepository(Widget::class)->findOneBy(['name' => $widgetName]);
        $instance = $om->getRepository(WidgetInstance::class)->findOneBy(['widget' => $widget]);

        $config = $om->getRepository(LandingWidget::class)->findOneBy(['widgetInstance' => $instance]);

        return $config?->getParameters();
    }

    private function getContainerConfig(string $widgetName): ?WidgetContainerConfig
    {
        $om = $this->getOm();

        $widget = $om->getRepository(Widget::class)->findOneBy(['name' => $widgetName]);
        $instance = $om->getRepository(WidgetInstance::class)->findOneBy(['widget' => $widget]);

        $container = $instance->getContainer();

        return $container?->getWidgetContainerConfigs()[0] ?? null;
    }

    /**
     * The pre-C-14 hero copy seeded by C-8 (15.0.100) / C-11 (deep-teal poster,
     * brand + year topbar, no topline / stamp parameters).
     */
    private function getLegacyHeroParameters(): array
    {
        return [
            'title' => 'AI = 协同 + 伙伴',
            'subtitle' => '用AI学AI，让学习多一点DIY',
            'cta' => [
                'label' => '登录 / 注册',
                'href' => '/login',
            ],
            'background' => 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)',
            'brand' => '澜之轩 · Claroline',
            'year' => '2026 · AI 元年',
            'en' => [
                'title' => 'AI = Collaboration + Companion',
                'subtitle' => 'Learn AI with AI — make learning more DIY',
                'cta' => [
                    'label' => 'Sign In / Register',
                    'href' => '/login',
                ],
                'brand' => '澜之轩 · Claroline',
                'year' => '2026 · Year of AI',
            ],
        ];
    }

    /**
     * The pre-C-14 features copy seeded by C-13 (15.0.101, 方案 B 深底).
     */
    private function getLegacyFeaturesParameters(): array
    {
        return [
            'title' => '平台特色',
            'subtitle' => '三大能力，一个平台',
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

    /**
     * The pre-C-14 packaging copy seeded by C-8 (15.0.100).
     */
    private function getLegacyPackagingParameters(): array
    {
        return [
            'title' => '一处建设，处处可达',
            'subtitle' => '平台提供打包环境，一套内容，多端分发',
            'platforms' => [
                ['icon' => 'mini', 'name' => '小程序', 'desc' => '轻量即用，随时学习'],
                ['icon' => 'desktop', 'name' => '桌面', 'desc' => '完整功能，高效教学'],
                ['icon' => 'app', 'name' => '应用', 'desc' => '移动端随行，处处可学'],
            ],
            'en' => [
                'title' => 'Build once, reach everywhere',
                'subtitle' => 'A packaging environment — one set of content, every device',
                'platforms' => [
                    ['icon' => 'mini', 'name' => 'Mini program', 'desc' => 'Lightweight, learn anytime'],
                    ['icon' => 'desktop', 'name' => 'Desktop', 'desc' => 'Full features, efficient teaching'],
                    ['icon' => 'app', 'name' => 'Mobile app', 'desc' => 'On the go, learn anywhere'],
                ],
            ],
        ];
    }

    public function testUpdatesHeroFeaturesPackagingToTheLightCopy(): void
    {
        // legacy environment: the three widgets updated by 15.0.102, plus an
        // untouched ai widget to prove the updater only touches the target ones
        $this->seedLandingInstance('landing-hero', '首页主视觉', $this->getLegacyHeroParameters());
        $this->seedLandingInstance('landing-features', '核心功能', $this->getLegacyFeaturesParameters());
        $this->seedLandingInstance('landing-packaging', '打包环境', $this->getLegacyPackagingParameters());
        $this->seedLandingInstance('landing-ai', 'AI 能力', ['title' => 'AI，嵌入平台每一处']);

        $this->getUpdater()->postUpdate();

        // --- hero: topline + white gradient + cleared year/brand, stamp enabled ---
        $hero = $this->getLandingParameters('landing-hero');
        $this->assertSame('2026有人称之为元年，学习将由此而变', $hero['topline'] ?? null, 'The hero topline should be the C-14 narrative.');
        $this->assertSame('linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', $hero['background'] ?? null, 'The hero background should be the white gradient.');
        $this->assertSame('', $hero['year'] ?? 'x', 'The hero year should be cleared (stamp carries the brand).');
        $this->assertSame('', $hero['brand'] ?? 'x', 'The hero brand text should be cleared (seal carries the brand).');
        $this->assertTrue($hero['stamp']['enabled'] ?? false, 'The hero stamp should be enabled.');
        $this->assertSame('澜之轩', $hero['stamp']['text'] ?? null, 'The hero stamp text should be 澜之轩.');
        // preserved values
        $this->assertSame('AI = 协同 + 伙伴', $hero['title'] ?? null, 'The hero title should be preserved.');
        $this->assertSame('用AI学AI，让学习多一点DIY', $hero['subtitle'] ?? null, 'The hero subtitle should be preserved.');
        $this->assertSame('/login', $hero['cta']['href'] ?? null, 'The hero CTA should be preserved.');
        // complete English copy
        $this->assertSame('2026 — the year AI took off', $hero['en']['topline'] ?? null, 'The en topline should exist.');
        $this->assertSame('澜之轩', $hero['en']['stamp']['text'] ?? null, 'The en stamp text should exist.');

        // --- features: DIY 三卡 + light wash + light container ---
        $features = $this->getLandingParameters('landing-features');
        $this->assertSame('平台特色', $features['title'] ?? null, 'The features title should be preserved.');
        $this->assertSame('linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)', $features['background'] ?? null, 'The features background slot should carry the light wash.');
        $this->assertCount(3, $features['cards'] ?? [], 'The features should keep 3 cards.');
        $this->assertSame('DIY工具', $features['cards'][0]['title'] ?? null);
        $this->assertSame('fa fa-fw fa-tools', $features['cards'][0]['icon'] ?? null);
        $this->assertSame('自制工具，动手学习', $features['cards'][0]['desc'] ?? null);
        $this->assertSame('AI助学·个性定制', $features['cards'][1]['title'] ?? null);
        $this->assertSame('fa fa-fw fa-robot', $features['cards'][1]['icon'] ?? null);
        $this->assertSame('AI 助教，学情适配', $features['cards'][1]['desc'] ?? null);
        $this->assertSame('Idea展示', $features['cards'][2]['title'] ?? null);
        $this->assertSame('fa fa-fw fa-lightbulb', $features['cards'][2]['icon'] ?? null);
        $this->assertSame('创意激发，作品分享', $features['cards'][2]['desc'] ?? null);
        // 第 3 卡 tone = soft (浅青卡差异化, D5/D8)
        $this->assertSame('soft', $features['cards'][2]['tone'] ?? null, 'The third card should carry the soft tone.');
        // complete English copy
        $this->assertSame('DIY Tools', $features['en']['cards'][0]['title'] ?? null);
        $this->assertSame('AI Tutoring, Personalized', $features['en']['cards'][1]['title'] ?? null);
        $this->assertSame('Idea Showcase', $features['en']['cards'][2]['title'] ?? null);
        // container display: light wash instead of the deep teal
        $containerConfig = $this->getContainerConfig('landing-features');
        $this->assertNotNull($containerConfig, 'The features container config should exist.');
        $this->assertSame('#0f172a', $containerConfig->getColor());
        $this->assertSame('color', $containerConfig->getBackgroundType());
        $this->assertSame('#f0fdfa', $containerConfig->getBackground());

        // --- packaging: new title/subtitle, platforms preserved ---
        $packaging = $this->getLandingParameters('landing-packaging');
        $this->assertSame('一处编译，多端访问', $packaging['title'] ?? null, 'The packaging title should be the C-14 copy.');
        $this->assertSame('一套代码，多端运行', $packaging['subtitle'] ?? null, 'The packaging subtitle should be the C-14 copy.');
        $this->assertSame('小程序', $packaging['platforms'][0]['name'] ?? null, 'The zh platforms should be preserved.');
        $this->assertSame('Build once, run everywhere', $packaging['en']['title'] ?? null, 'The en title should be the C-14 copy.');
        $this->assertSame('One codebase, every device', $packaging['en']['subtitle'] ?? null, 'The en subtitle should be the C-14 copy.');
        $this->assertSame('Mini program', $packaging['en']['platforms'][0]['name'] ?? null, 'The en platforms should be preserved.');

        // only the three target widgets are touched: ai 实例原样保留
        $ai = $this->getLandingParameters('landing-ai');
        $this->assertSame('AI，嵌入平台每一处', $ai['title'] ?? null, 'The ai instance must not be touched.');
    }

    public function testIsIdempotent(): void
    {
        $this->seedLandingInstance('landing-hero', '首页主视觉', $this->getLegacyHeroParameters());
        $this->seedLandingInstance('landing-features', '核心功能', $this->getLegacyFeaturesParameters());
        $this->seedLandingInstance('landing-packaging', '打包环境', $this->getLegacyPackagingParameters());

        $updater = $this->getUpdater();
        $updater->postUpdate();

        $firstHero = $this->getLandingParameters('landing-hero');
        $firstFeatures = $this->getLandingParameters('landing-features');
        $firstPackaging = $this->getLandingParameters('landing-packaging');

        $this->assertSame('2026有人称之为元年，学习将由此而变', $firstHero['topline'] ?? null, 'The first run should apply the new copy.');

        // second run: every idempotency marker already matches, nothing may change
        $updater->postUpdate();

        $secondHero = $this->getLandingParameters('landing-hero');
        $secondFeatures = $this->getLandingParameters('landing-features');
        $secondPackaging = $this->getLandingParameters('landing-packaging');

        $this->assertSame($firstHero, $secondHero, 'Running the updater twice should leave the hero parameters unchanged.');
        $this->assertSame($firstFeatures, $secondFeatures, 'Running the updater twice should leave the features parameters unchanged.');
        $this->assertSame($firstPackaging, $secondPackaging, 'Running the updater twice should leave the packaging parameters unchanged.');

        // container display stays light after the second run
        $containerConfig = $this->getContainerConfig('landing-features');
        $this->assertSame('#f0fdfa', $containerConfig->getBackground());
    }
}
