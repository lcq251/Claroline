<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\HomeBundle\Tests\Installation\Updater;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\PublicContext;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\HomeBundle\Installation\Updater\Updater150101;

class Updater150101Test extends TransactionalTestCase
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

    private function getUpdater(): Updater150101
    {
        $container = $this->client->getContainer();

        return new Updater150101(
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
}
