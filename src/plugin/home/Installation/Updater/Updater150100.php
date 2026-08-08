<?php

namespace Claroline\HomeBundle\Installation\Updater;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\AdministrationContext;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\HomeBundle\Entity\Type\WidgetsTab;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Creates the default Home tabs ("information") for the desktop and the
 * administration contexts so freshly installed / upgraded environments
 * get them automatically, without relying on manual SQL or post-install
 * fixtures (which are only executed on a full installation).
 */
class Updater150100 extends Updater
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer,
        private readonly TranslatorInterface $translator
    ) {
    }

    public function postUpdate(): void
    {
        $this->createDefaultTab(DesktopContext::getName(), $this->getDesktopTabData());
        $this->createDefaultTab(AdministrationContext::getName(), $this->getAdminTabData());
    }

    private function createDefaultTab(string $contextName, array $defaultTab): void
    {
        if ($this->hasDefaultTab($contextName)) {
            $this->logger?->info(sprintf('Default tab already exists in "%s" context, skipping.', $contextName));

            return;
        }

        $tab = new HomeTab();
        $tab->setContextName($contextName);

        $this->serializer->deserialize($defaultTab, $tab);

        $this->om->persist($tab);
        $this->om->flush();

        $this->logger?->info(sprintf('Default tab created in "%s" context.', $contextName));
    }

    /**
     * Checks whether a default "information" tab already exists in the context.
     *
     * The check is locale tolerant because tabs may have been created in any of the
     * platform locales (e.g. manually inserted rows or fixtures run in another locale),
     * while the updater itself runs with the platform default locale (see CommandListener).
     */
    private function hasDefaultTab(string $contextName): bool
    {
        // platform available locales (see LocaleManager::getAvailableLocales())
        $locales = ['en', 'fr', 'nl', 'zh'];

        $names = array_unique(array_map(
            fn (string $locale) => $this->translator->trans('information', [], 'platform', $locale),
            $locales
        ));

        $tabs = $this->om->getRepository(HomeTab::class)->findBy(['contextName' => $contextName]);

        foreach ($tabs as $tab) {
            if (in_array($tab->getName(), $names, true)) {
                return true;
            }
        }

        return false;
    }

    private function getDesktopTabData(): array
    {
        return [
            'title' => $this->translator->trans('information', [], 'platform'),
            'longTitle' => $this->translator->trans('information', [], 'platform'),
            'slug' => 'information',
            'type' => WidgetsTab::getType(),
            'class' => WidgetsTab::class,
            'position' => 1,
            'restrictions' => [
                'hidden' => false,
            ],
            'parameters' => [
                'widgets' => [[
                    'name' => $this->translator->trans('my_workspaces', [], 'workspace'),
                    'visible' => true,
                    'display' => [
                        'layout' => [1],
                        'color' => '#333333',
                        'backgroundType' => 'color',
                        'background' => '#ffffff',
                    ],
                    'parameters' => [],
                    'contents' => [[
                        'type' => 'list',
                        'source' => 'my_workspaces',
                        'parameters' => [
                            'display' => 'tiles',
                            'enableDisplays' => false,
                            'availableDisplays' => [],
                            'card' => [
                                'display' => [
                                    'icon',
                                    'flags',
                                    'subtitle',
                                    'description',
                                    'footer',
                                ],
                            ],
                            'paginated' => true,
                            'count' => true,
                        ],
                    ]],
                ]],
            ],
        ];
    }

    private function getAdminTabData(): array
    {
        return [
            'title' => $this->translator->trans('information', [], 'platform'),
            'longTitle' => $this->translator->trans('information', [], 'platform'),
            'slug' => 'information',
            'type' => WidgetsTab::getType(),
            'class' => WidgetsTab::class,
            'position' => 1,
            'restrictions' => [
                'hidden' => false,
            ],
            'parameters' => [
                'widgets' => [[
                    'visible' => true,
                    'display' => [
                        'layout' => [1],
                        'color' => '#333333',
                        'backgroundType' => 'color',
                        'background' => '#ffffff',
                    ],
                    'parameters' => [],
                    'contents' => [[
                        'type' => 'list',
                        'source' => 'admin_tools',
                        'parameters' => [
                            'display' => 'tiles',
                            'enableDisplays' => false,
                            'availableDisplays' => [],
                            'card' => [
                                'display' => ['icon', 'flags', 'subtitle'],
                            ],
                            'paginated' => false,
                            'count' => false,
                        ],
                    ]],
                ]],
            ],
        ];
    }
}
