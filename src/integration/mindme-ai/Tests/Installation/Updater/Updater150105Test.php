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
use Claroline\MindMeAiBundle\Installation\Updater\Updater150105;

class Updater150105Test extends TransactionalTestCase
{
    private function getOm(): ObjectManager
    {
        return $this->client->getContainer()->get(ObjectManager::class);
    }

    private function getUpdater(): Updater150105
    {
        return new Updater150105($this->getOm());
    }

    /**
     * Seeds a landing widget (definition + container + parameter row) with the
     * given parameters, mirroring what the previous updaters (15.0.100 → 15.0.104)
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

    /**
     * The pre-C-17 hero copy seeded by C-14/C-16 (15.0.102/15.0.104): the S1
     * seal is enabled with the 3-char 「澜之轩」text — these must be refreshed
     * to the 6-char 「澜之轩工作室」while every other key stays untouched.
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
            'topline' => '2026有人称之为元年，学习将由此而变',
            'background' => 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
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
     * The pre-C-17 features copy seeded by C-14 (15.0.102): DIY 三卡 with the
     * 3rd card tone = soft — these must become the C-17 unified copy with all
     * tones normal.
     */
    private function getLegacyFeaturesParameters(): array
    {
        return [
            'title' => '平台特色',
            'subtitle' => '三大能力，一个平台',
            'background' => 'linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)',
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

    public function testUpdateHeroStampToSixCharacters(): void
    {
        $this->seedLandingInstance('landing-hero', '首页主视觉', $this->getLegacyHeroParameters());

        $this->getUpdater()->postUpdate();

        $hero = $this->getLandingParameters('landing-hero');
        $this->assertSame('澜之轩工作室', $hero['stamp']['text'] ?? null, 'The hero stamp text should become the 6-char brand.');
        $this->assertTrue($hero['stamp']['enabled'] ?? false, 'The hero stamp should stay enabled.');
        $this->assertSame('澜之轩工作室', $hero['en']['stamp']['text'] ?? null, 'The en stamp text should be synced.');
        $this->assertTrue($hero['en']['stamp']['enabled'] ?? false, 'The en stamp should stay enabled.');

        // read-modify-write: everything else is preserved
        $this->assertSame('AI = 协同 + 伙伴', $hero['title'] ?? null, 'The hero title should be preserved.');
        $this->assertSame('用AI学AI，让学习多一点DIY', $hero['subtitle'] ?? null, 'The hero subtitle should be preserved.');
        $this->assertSame('2026有人称之为元年，学习将由此而变', $hero['topline'] ?? null, 'The hero topline should be preserved.');
        $this->assertSame('linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)', $hero['background'] ?? null, 'The hero background should be preserved.');
        $this->assertSame('/login', $hero['cta']['href'] ?? null, 'The hero CTA should be preserved.');
        $this->assertSame('', $hero['brand'] ?? 'x', 'The hero brand should stay cleared.');
        $this->assertSame('', $hero['year'] ?? 'x', 'The hero year should stay cleared.');
        $this->assertSame('2026 — the year AI took off', $hero['en']['topline'] ?? null, 'The en topline should be preserved.');
    }

    public function testUpdateFeaturesCardsToUnifiedCopy(): void
    {
        $this->seedLandingInstance('landing-features', '核心功能', $this->getLegacyFeaturesParameters());

        $this->getUpdater()->postUpdate();

        $features = $this->getLandingParameters('landing-features');

        // zh cards: the C-17 unified copy (D4 用户拍板), all tones normal
        $this->assertSame('适配工具，辅助教学', $features['cards'][0]['desc'] ?? null, 'Card 1 desc should be refreshed.');
        $this->assertSame('DIY工具', $features['cards'][0]['title'] ?? null, 'Card 1 title should be preserved.');
        $this->assertSame('normal', $features['cards'][0]['tone'] ?? null, 'Card 1 tone should be normal.');

        $this->assertSame('个性学习', $features['cards'][1]['title'] ?? null, 'Card 2 title should be refreshed.');
        $this->assertSame('ai助学，自主可控', $features['cards'][1]['desc'] ?? null, 'Card 2 desc should be refreshed.');
        $this->assertSame('normal', $features['cards'][1]['tone'] ?? null, 'Card 2 tone should be normal.');

        $this->assertSame('Idea展示', $features['cards'][2]['title'] ?? null, 'Card 3 title should be preserved.');
        $this->assertSame('灵感乍现，嵌入支撑', $features['cards'][2]['desc'] ?? null, 'Card 3 desc should be refreshed.');
        $this->assertSame('normal', $features['cards'][2]['tone'] ?? null, 'Card 3 tone should be normal (no soft differentiation).');

        // en cards synced (D5)
        $this->assertSame('DIY Tools', $features['en']['cards'][0]['title'] ?? null);
        $this->assertSame('Adaptable tools, assisted teaching', $features['en']['cards'][0]['desc'] ?? null);
        $this->assertSame('Personalized Learning', $features['en']['cards'][1]['title'] ?? null);
        $this->assertSame('AI tutoring, self-controlled', $features['en']['cards'][1]['desc'] ?? null);
        $this->assertSame('Idea Showcase', $features['en']['cards'][2]['title'] ?? null);
        $this->assertSame('Inspiration sparks, embedded support', $features['en']['cards'][2]['desc'] ?? null);
        $this->assertSame('normal', $features['en']['cards'][0]['tone'] ?? null);
        $this->assertSame('normal', $features['en']['cards'][1]['tone'] ?? null);
        $this->assertSame('normal', $features['en']['cards'][2]['tone'] ?? null);

        // read-modify-write: section title / subtitle / background preserved
        $this->assertSame('平台特色', $features['title'] ?? null, 'The features title should be preserved.');
        $this->assertSame('三大能力，一个平台', $features['subtitle'] ?? null, 'The features subtitle should be preserved.');
        $this->assertSame('linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)', $features['background'] ?? null, 'The features background should be preserved.');
        $this->assertSame('Platform Features', $features['en']['title'] ?? null, 'The en title should be preserved.');
    }

    public function testIsIdempotent(): void
    {
        // hero + features already carry the C-17 copy (updater ran before)
        $hero = $this->getLegacyHeroParameters();
        $hero['stamp']['text'] = '澜之轩工作室';
        $hero['en']['stamp']['text'] = '澜之轩工作室';
        $this->seedLandingInstance('landing-hero', '首页主视觉', $hero);

        $features = $this->getLegacyFeaturesParameters();
        $features['cards'][0]['desc'] = '适配工具，辅助教学';
        $features['cards'][2]['tone'] = 'normal';
        $this->seedLandingInstance('landing-features', '核心功能', $features);

        $updater = $this->getUpdater();
        $updater->postUpdate();

        $firstHero = $this->getLandingParameters('landing-hero');
        $firstFeatures = $this->getLandingParameters('landing-features');
        $this->assertSame('澜之轩工作室', $firstHero['stamp']['text'] ?? null, 'The first run should keep the new stamp text.');
        $this->assertSame('适配工具，辅助教学', $firstFeatures['cards'][0]['desc'] ?? null, 'The first run should keep the new card copy.');

        // second run: the markers already match, nothing may change
        $updater->postUpdate();

        $secondHero = $this->getLandingParameters('landing-hero');
        $secondFeatures = $this->getLandingParameters('landing-features');
        $this->assertSame($firstHero, $secondHero, 'Running the updater twice should leave the hero parameters unchanged.');
        $this->assertSame($firstFeatures, $secondFeatures, 'Running the updater twice should leave the features parameters unchanged.');
    }

    public function testDoesNotTouchOtherWidgets(): void
    {
        $this->seedLandingInstance('landing-hero', '首页主视觉', $this->getLegacyHeroParameters());
        $this->seedLandingInstance('landing-features', '核心功能', $this->getLegacyFeaturesParameters());
        $this->seedLandingInstance('landing-ai', 'AI 能力', [
            'title' => 'AI，嵌入平台每一处',
            'badge' => 'AI 基座 + 安全 —— 内置模型接入与数据安全底座',
        ]);
        $this->seedLandingInstance('landing-packaging', '打包环境', [
            'title' => '一处编译，多端访问',
            'subtitle' => '一套代码，多端运行',
        ]);
        $this->seedLandingInstance('landing-cta', '行动号召', [
            'title' => '马上开始你的 AI 学习之旅',
        ]);

        $this->getUpdater()->postUpdate();

        // hero + features are refreshed...
        $hero = $this->getLandingParameters('landing-hero');
        $this->assertSame('澜之轩工作室', $hero['stamp']['text'] ?? null, 'The hero stamp should be refreshed.');
        $features = $this->getLandingParameters('landing-features');
        $this->assertSame('适配工具，辅助教学', $features['cards'][0]['desc'] ?? null, 'The features cards should be refreshed.');

        // ...but the other landing widgets must never be touched
        $ai = $this->getLandingParameters('landing-ai');
        $this->assertSame('AI，嵌入平台每一处', $ai['title'] ?? null, 'The ai widget must not be touched.');
        $this->assertSame('AI 基座 + 安全 —— 内置模型接入与数据安全底座', $ai['badge'] ?? null, 'The ai widget must not be touched.');

        $packaging = $this->getLandingParameters('landing-packaging');
        $this->assertSame('一处编译，多端访问', $packaging['title'] ?? null, 'The packaging widget must not be touched.');
        $this->assertSame('一套代码，多端运行', $packaging['subtitle'] ?? null, 'The packaging widget must not be touched.');

        $cta = $this->getLandingParameters('landing-cta');
        $this->assertSame('马上开始你的 AI 学习之旅', $cta['title'] ?? null, 'The cta widget must not be touched.');
    }
}
