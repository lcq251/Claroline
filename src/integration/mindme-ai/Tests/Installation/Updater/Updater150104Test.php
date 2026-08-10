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
use Claroline\MindMeAiBundle\Installation\Updater\Updater150104;

class Updater150104Test extends TransactionalTestCase
{
    private function getOm(): ObjectManager
    {
        return $this->client->getContainer()->get(ObjectManager::class);
    }

    private function getUpdater(): Updater150104
    {
        return new Updater150104($this->getOm());
    }

    /**
     * Seeds a landing widget (definition + container + parameter row) with the
     * given parameters, mirroring what the previous updaters (15.0.100 → 15.0.102)
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
     * The pre-C-16 hero copy seeded by C-14 (15.0.102): white gradient
     * background, topline + stamp + complete en block already present — these
     * must all be preserved when the background is refreshed.
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
            'background' => 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
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

    public function testUpdateHeroBackgroundToTheLightTealWash(): void
    {
        // an already-installed C-14 environment: hero carries the white
        // gradient, features carries the wash gradient (must not be touched)
        $this->seedLandingInstance('landing-hero', '首页主视觉', $this->getLegacyHeroParameters());
        $this->seedLandingInstance('landing-features', '核心功能', [
            'title' => '平台特色',
            'subtitle' => '三大能力，一个平台',
            'background' => 'linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)',
        ]);

        $this->getUpdater()->postUpdate();

        // --- hero: background refreshed, everything else preserved ---
        $hero = $this->getLandingParameters('landing-hero');
        $this->assertSame(
            'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
            $hero['background'] ?? null,
            'The hero background should be the C-16 上青下白渐变.'
        );
        // preserved copy (read-modify-write must not clear the other keys)
        $this->assertSame('AI = 协同 + 伙伴', $hero['title'] ?? null, 'The hero title should be preserved.');
        $this->assertSame('用AI学AI，让学习多一点DIY', $hero['subtitle'] ?? null, 'The hero subtitle should be preserved.');
        $this->assertSame('/login', $hero['cta']['href'] ?? null, 'The hero CTA should be preserved.');
        $this->assertSame('2026有人称之为元年，学习将由此而变', $hero['topline'] ?? null, 'The hero topline should be preserved.');
        $this->assertSame('', $hero['brand'] ?? 'x', 'The hero brand should stay cleared.');
        $this->assertSame('', $hero['year'] ?? 'x', 'The hero year should stay cleared.');
        $this->assertTrue($hero['stamp']['enabled'] ?? false, 'The hero stamp should stay enabled.');
        $this->assertSame('澜之轩', $hero['stamp']['text'] ?? null, 'The hero stamp text should be preserved.');
        // complete English block preserved
        $this->assertSame('2026 — the year AI took off', $hero['en']['topline'] ?? null, 'The en topline should be preserved.');
        $this->assertSame('澜之轩', $hero['en']['stamp']['text'] ?? null, 'The en stamp text should be preserved.');

        // --- only the hero is touched: features instance stays as-is ---
        $features = $this->getLandingParameters('landing-features');
        $this->assertSame('linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)', $features['background'] ?? null, 'The features instance must not be touched.');
        $this->assertSame('平台特色', $features['title'] ?? null, 'The features title must not be touched.');
    }

    public function testIsIdempotent(): void
    {
        // hero already carries the C-16 gradient (updater ran before)
        $parameters = $this->getLegacyHeroParameters();
        $parameters['background'] = 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)';
        $this->seedLandingInstance('landing-hero', '首页主视觉', $parameters);

        $updater = $this->getUpdater();
        $updater->postUpdate();

        $first = $this->getLandingParameters('landing-hero');
        $this->assertSame('linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)', $first['background'] ?? null, 'The first run should keep the new gradient.');

        // second run: the marker already matches, nothing may change
        $updater->postUpdate();

        $second = $this->getLandingParameters('landing-hero');
        $this->assertSame($first, $second, 'Running the updater twice should leave the hero parameters unchanged.');
    }

    public function testHandlesMissingBackground(): void
    {
        // an ancient instance without any background parameter gets the gradient
        $this->seedLandingInstance('landing-hero', '首页主视觉', [
            'title' => 'AI = 协同 + 伙伴',
            'subtitle' => '用AI学AI，让学习多一点DIY',
        ]);

        $this->getUpdater()->postUpdate();

        $hero = $this->getLandingParameters('landing-hero');
        $this->assertSame('linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)', $hero['background'] ?? null);
        $this->assertSame('AI = 协同 + 伙伴', $hero['title'] ?? null, 'The title should be preserved.');
    }
}
