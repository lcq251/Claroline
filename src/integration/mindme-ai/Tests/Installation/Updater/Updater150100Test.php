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

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\PublicContext;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\HomeBundle\Entity\Widget\LandingWidget as HomeLandingWidget;
use Claroline\MindMeAiBundle\Entity\Widget\LandingWidget;
use Claroline\MindMeAiBundle\Installation\Updater\Updater150100;

class Updater150100Test extends TransactionalTestCase
{
    /**
     * The 5 landing widgets seeded in the public landing tab.
     */
    private const LANDING_WIDGETS = [
        'landing-hero',
        'landing-features',
        'landing-ai',
        'landing-packaging',
        'landing-cta',
    ];

    private function getUpdater(): Updater150100
    {
        $container = $this->client->getContainer();

        return new Updater150100(
            $container->get(ObjectManager::class),
            $container->get(SerializerProvider::class)
        );
    }

    private function getPublicTabs(): array
    {
        $om = $this->client->getContainer()->get(ObjectManager::class);

        return $om->getRepository(HomeTab::class)->findBy([
            'contextName' => PublicContext::getName(),
        ]);
    }

    /**
     * Mirrors the slug computation of HomeTabSerializer::serialize().
     */
    private function tabSlug(HomeTab $tab): string
    {
        $longTitle = $tab->getLongTitle();

        return $longTitle
            ? substr(strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $longTitle))), 0, 128)
            : 'new';
    }

    public function testCreatesLandingTabWithAllWidgetsWhenNoPublicTabExists(): void
    {
        $this->getUpdater()->postUpdate();

        $tabs = $this->getPublicTabs();
        $this->assertCount(1, $tabs, 'Exactly one public tab should be created.');

        $tab = $tabs[0];
        $this->assertSame('landing', $this->tabSlug($tab), 'The public tab slug should be "landing".');

        // the seeded tab must be exposed with the 5 landing widget instances
        $serializer = $this->client->getContainer()->get(SerializerProvider::class);
        $data = $serializer->serialize($tab);

        $this->assertArrayHasKey('parameters', $data, 'The landing tab should expose its widgets parameters.');
        $this->assertArrayHasKey('widgets', $data['parameters'], 'The landing tab should expose its widgets list.');
        $this->assertCount(5, $data['parameters']['widgets'], 'The landing tab should seed exactly 5 widget containers.');

        $types = array_map(
            fn (array $widget) => $widget['contents'][0]['type'] ?? null,
            $data['parameters']['widgets']
        );

        sort($types);
        $expected = self::LANDING_WIDGETS;
        sort($expected);

        $this->assertSame($expected, $types, 'The landing tab should seed the 5 landing widget types.');

        // the 5 landing widgets must be registered in the platform widget table
        // with the MindMeAiBundle implementation class
        $om = $this->client->getContainer()->get(ObjectManager::class);
        $registered = $om->getRepository(Widget::class)->findBy(['name' => self::LANDING_WIDGETS]);
        $this->assertCount(5, $registered, 'The updater should register the 5 landing widgets in claro_widget.');

        foreach ($registered as $widget) {
            $this->assertSame(LandingWidget::class, $widget->getClass(), 'The landing widgets should use the MindMeAiBundle class.');
        }
    }

    public function testSkipsCreationWhenLandingTabAlreadyExists(): void
    {
        $updater = $this->getUpdater();

        // first run creates the tab
        $updater->postUpdate();
        $this->assertCount(1, $this->getPublicTabs());

        // second run must be a no-op (idempotency)
        $updater->postUpdate();
        $this->assertCount(1, $this->getPublicTabs(), 'Running the updater twice should not create a second tab.');
    }

    public function testHeroSeedCarriesMinimalFirstScreenParameters(): void
    {
        $this->getUpdater()->postUpdate();

        $tabs = $this->getPublicTabs();
        $this->assertCount(1, $tabs);

        $serializer = $this->client->getContainer()->get(SerializerProvider::class);
        $data = $serializer->serialize($tabs[0]);

        $hero = null;
        foreach ($data['parameters']['widgets'] as $widget) {
            if (('landing-hero' === ($widget['contents'][0]['type'] ?? null))) {
                $hero = $widget['contents'][0]['parameters'] ?? [];

                break;
            }
        }

        $this->assertNotNull($hero, 'The landing tab should seed the hero widget.');
        $this->assertSame('AI = 协同 + 伙伴', $hero['title'] ?? null, 'The hero title should be the C-11 equation string.');
        $this->assertSame('用AI学AI，让学习多一点DIY', $hero['subtitle'] ?? null, 'The hero subtitle should be the C-11 copy.');
        $this->assertSame('登录 / 注册', $hero['cta']['label'] ?? null, 'The hero should seed a single sign-in/register CTA.');
        $this->assertSame('/login', $hero['cta']['href'] ?? null, 'The single CTA should point to /login.');
        $this->assertSame('linear-gradient(135deg, #134e4a 0%, #0f766e 100%)', $hero['background'] ?? null, 'The hero background should be B3 深青海报.');
        $this->assertSame('澜之轩 · Claroline', $hero['brand'] ?? null, 'The top bar should seed the brand.');
        $this->assertSame('2026 · AI 元年', $hero['year'] ?? null, 'The top bar should seed the 2026 year stamp.');
        $this->assertSame('AI = Collaboration + Companion', $hero['en']['title'] ?? null, 'The en title should be the C-11 equation string.');

        // C-11 首屏极简: 不再 seed 叙事 / 视觉条 / 二维码 / 印章
        foreach (['story', 'visuals', 'wechat', 'stamp', 'quote'] as $removed) {
            $this->assertArrayNotHasKey($removed, $hero, sprintf('The minimal hero seed should not provide "%s".', $removed));
            $this->assertArrayNotHasKey($removed, $hero['en'] ?? [], sprintf('The en hero seed should not provide "%s".', $removed));
        }
    }

    public function testSwitchesLegacyWidgetClassToMindMeAiBundle(): void
    {
        $om = $this->client->getContainer()->get(ObjectManager::class);

        // simulate a pre-migration environment: the 5 landing widgets are
        // registered under the HomeBundle implementation class
        foreach (self::LANDING_WIDGETS as $name) {
            $widget = new Widget();
            $widget->setName($name);
            $widget->setClass(HomeLandingWidget::class);
            $widget->setContext([PublicContext::getName()]);
            $widget->setSources([]);
            $widget->setTags(['content']);
            $widget->setExportable(false);

            $om->persist($widget);
        }
        $om->flush();

        $this->getUpdater()->postUpdate();

        $registered = $om->getRepository(Widget::class)->findBy(['name' => self::LANDING_WIDGETS]);
        $this->assertCount(5, $registered);

        foreach ($registered as $widget) {
            $this->assertSame(LandingWidget::class, $widget->getClass(), 'The updater should switch the widget class to MindMeAiBundle.');
        }
    }

    public function testMigratesLegacyParametersFromHomeTable(): void
    {
        $om = $this->client->getContainer()->get(ObjectManager::class);
        $connection = $om->getConnection();

        // cleanup any leftovers from previous runs (the backup DDL commits
        // the surrounding transaction, so this test is not fully rollback-safe)
        $connection->executeStatement('DELETE FROM claro_mindme_landing_widget');
        $connection->executeStatement('DELETE FROM claro_home_landing_widget');

        // simulate a pre-migration environment: one landing widget registered
        // under HomeBundle with parameters stored in the legacy table
        $widget = new Widget();
        $widget->setName('landing-hero');
        $widget->setClass(HomeLandingWidget::class);
        $widget->setContext([PublicContext::getName()]);
        $widget->setSources([]);
        $widget->setTags(['content']);
        $widget->setExportable(false);
        $om->persist($widget);

        $instance = new \Claroline\CoreBundle\Entity\Widget\WidgetInstance();
        $instance->setWidget($widget);
        $om->persist($instance);

        $legacyParameters = new HomeLandingWidget();
        $legacyParameters->setParameters(['title' => 'AI = 协同 + 伙伴']);
        $legacyParameters->setWidgetInstance($instance);
        $om->persist($legacyParameters);
        $om->flush();

        $instanceId = $instance->getId();
        $this->assertNotNull($instanceId);

        // run the updater: it must backup the legacy table, move the parameter
        // row into the mindme table and empty the legacy table
        $this->getUpdater()->postUpdate();

        $migrated = $connection->fetchAllAssociative(
            'SELECT * FROM claro_mindme_landing_widget WHERE widgetInstance_id = ?',
            [$instanceId]
        );
        $this->assertCount(1, $migrated, 'The legacy parameters should be moved into claro_mindme_landing_widget.');
        $this->assertSame('AI = 协同 + 伙伴', json_decode($migrated[0]['parameters'], true)['title'] ?? null, 'The migrated parameters should be preserved.');

        $legacy = $connection->fetchAllAssociative('SELECT * FROM claro_home_landing_widget');
        $this->assertCount(0, $legacy, 'The legacy table should be empty after the migration.');

        $backup = $connection->fetchAllAssociative('SELECT * FROM claro_home_landing_widget_bak');
        $this->assertCount(1, $backup, 'The legacy table should be backed up before being emptied.');

        // running the updater a second time must stay idempotent
        $this->getUpdater()->postUpdate();
        $migrated = $connection->fetchAllAssociative(
            'SELECT * FROM claro_mindme_landing_widget WHERE widgetInstance_id = ?',
            [$instanceId]
        );
        $this->assertCount(1, $migrated, 'Running the updater twice should not duplicate the migrated parameters.');
    }
}
