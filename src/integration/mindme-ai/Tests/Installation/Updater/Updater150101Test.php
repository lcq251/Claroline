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
use Claroline\MindMeAiBundle\Installation\Updater\Updater150101;

class Updater150101Test extends TransactionalTestCase
{
    private function getOm(): ObjectManager
    {
        return $this->client->getContainer()->get(ObjectManager::class);
    }

    private function getUpdater(): Updater150101
    {
        return new Updater150101($this->getOm());
    }

    /**
     * Seeds a landing widget (definition + container + parameter row) with the
     * given parameters, mirroring what the C-8 updater (15.0.100) leaves behind
     * on an already-installed environment.
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
     * The pre-C-13 features copy seeded by the C-8 updater (15.0.100).
     */
    private function getLegacyFeaturesParameters(): array
    {
        return [
            'title' => '三大块，一个平台',
            'cards' => [
                [
                    'num' => '01 · TEACHER',
                    'icon' => 'fa fa-fw fa-chalkboard-teacher',
                    'title' => '为老师提供教学工具',
                    'desc' => '备课、授课、布置、评估，AI 加持提效',
                    'en' => 'Tools for teachers',
                    'href' => '#feature-1',
                    'tone' => 'normal',
                ],
                [
                    'num' => '02 · LEARNER',
                    'icon' => 'fa fa-fw fa-graduation-cap',
                    'title' => '为学生提供学习方法',
                    'desc' => '个性化学习路径、AI 助教陪伴、学情反馈',
                    'en' => 'Learning methods',
                    'href' => '#feature-2',
                    'tone' => 'normal',
                ],
                [
                    'num' => '03 · PLATFORM',
                    'icon' => 'fa fa-fw fa-cubes',
                    'title' => 'AI 功能嵌入式平台',
                    'desc' => '提供 AI 基座与安全，开箱即用',
                    'en' => 'AI-native platform',
                    'href' => '#feature-3',
                    'tone' => 'dark',
                ],
            ],
            'en' => [
                'title' => 'Three blocks, one platform',
                'cards' => [
                    ['num' => '01 · TEACHER', 'icon' => 'fa fa-fw fa-chalkboard-teacher', 'title' => 'Tools for teachers', 'desc' => 'Prepare, teach, assign and assess — supercharged by AI', 'href' => '#feature-1', 'tone' => 'normal'],
                    ['num' => '02 · LEARNER', 'icon' => 'fa fa-fw fa-graduation-cap', 'title' => 'Learning methods for students', 'desc' => 'Personalized learning paths, AI companion, progress feedback', 'href' => '#feature-2', 'tone' => 'normal'],
                    ['num' => '03 · PLATFORM', 'icon' => 'fa fa-fw fa-cubes', 'title' => 'AI-native embedded platform', 'desc' => 'AI foundation and security, ready out of the box', 'href' => '#feature-3', 'tone' => 'dark'],
                ],
            ],
        ];
    }

    public function testUpdatesFeaturesInstanceToTheFrozenCopy(): void
    {
        // legacy environment: features widget with the pre-C-13 copy, plus an
        // untouched hero widget to prove the updater only touches features
        $this->seedLandingInstance('landing-features', '核心功能', $this->getLegacyFeaturesParameters());
        $this->seedLandingInstance('landing-hero', '首页主视觉', ['title' => 'AI = 协同 + 伙伴']);

        $this->getUpdater()->postUpdate();

        $parameters = $this->getLandingParameters('landing-features');

        $this->assertSame('平台特色', $parameters['title'] ?? null, 'The features title should be the frozen C-13 copy.');
        $this->assertSame('三大能力，一个平台', $parameters['subtitle'] ?? null, 'The features subtitle should be the frozen C-13 copy.');
        $this->assertSame('linear-gradient(135deg, #134e4a 0%, #0f766e 100%)', $parameters['background'] ?? null, 'The background schema slot should carry the deep-teal gradient.');

        $this->assertCount(3, $parameters['cards'] ?? [], 'The features should seed 3 cards.');
        $this->assertSame('老师工具', $parameters['cards'][0]['title'] ?? null);
        $this->assertSame('备课授课，AI 提效', $parameters['cards'][0]['desc'] ?? null);
        $this->assertSame('学习方法', $parameters['cards'][1]['title'] ?? null);
        $this->assertSame('AI 助教，因材施教', $parameters['cards'][1]['desc'] ?? null);
        $this->assertSame('AI 平台', $parameters['cards'][2]['title'] ?? null);
        $this->assertSame('基座安全，开箱即用', $parameters['cards'][2]['desc'] ?? null);

        // 第 3 卡 tone = soft (浅青卡差异化, spec §6)
        $this->assertSame('soft', $parameters['cards'][2]['tone'] ?? null, 'The third card should carry the soft tone.');

        // complete English copy must exist (bilingual, spec §4)
        $this->assertSame('Platform Features', $parameters['en']['title'] ?? null, 'The en title should exist.');
        $this->assertSame('Three capabilities, one platform', $parameters['en']['subtitle'] ?? null, 'The en subtitle should exist.');
        $this->assertSame('For Teachers', $parameters['en']['cards'][0]['title'] ?? null);
        $this->assertSame('Prep & teach, AI-boosted', $parameters['en']['cards'][0]['desc'] ?? null);
        $this->assertSame('For Learners', $parameters['en']['cards'][1]['title'] ?? null);
        $this->assertSame('AI tutor, teach to each', $parameters['en']['cards'][1]['desc'] ?? null);
        $this->assertSame('AI-Native', $parameters['en']['cards'][2]['title'] ?? null);
        $this->assertSame('Safe AI core, out of the box', $parameters['en']['cards'][2]['desc'] ?? null);

        // 容器 display 深青 (与 hero 容器一致)
        $containerConfig = $this->getContainerConfig('landing-features');
        $this->assertNotNull($containerConfig, 'The features container config should exist.');
        $this->assertSame('#ffffff', $containerConfig->getColor());
        $this->assertSame('color', $containerConfig->getBackgroundType());
        $this->assertSame('#0f766e', $containerConfig->getBackground());

        // 只动 features 一个: hero 实例参数原样保留
        $hero = $this->getLandingParameters('landing-hero');
        $this->assertSame('AI = 协同 + 伙伴', $hero['title'] ?? null, 'The hero instance must not be touched.');
    }

    public function testIsIdempotent(): void
    {
        $this->seedLandingInstance('landing-features', '核心功能', $this->getLegacyFeaturesParameters());

        $updater = $this->getUpdater();
        $updater->postUpdate();

        $first = $this->getLandingParameters('landing-features');
        $this->assertSame('平台特色', $first['title'] ?? null, 'The first run should apply the new copy.');

        // second run: title already equals the new value, nothing may change
        $updater->postUpdate();

        $second = $this->getLandingParameters('landing-features');
        $this->assertSame($first, $second, 'Running the updater twice should leave the parameters unchanged.');

        // container display stays deep teal after the second run
        $containerConfig = $this->getContainerConfig('landing-features');
        $this->assertSame('#0f766e', $containerConfig->getBackground());
    }
}
