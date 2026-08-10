<?php

namespace Claroline\MindMeAiBundle\Installation;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\HomeBundle\Entity\Type\WidgetsTab;
use Claroline\InstallationBundle\Additional\AdditionalInstaller;
use Claroline\MindMeAiBundle\Installation\Updater\Updater150100;
use Claroline\MindMeAiBundle\Installation\Updater\Updater150101;

class ClarolineMindMeAiInstaller extends AdditionalInstaller
{
    public function hasMigrations(): bool
    {
        return true;
    }

    public static function getUpdaters(): array
    {
        return [
            '15.0.100' => Updater150100::class,
            '15.0.101' => Updater150101::class,
        ];
    }

    public function postInstall(): void
    {
        /** @var ObjectManager $om */
        $om = $this->container->get(ObjectManager::class);
        /** @var SerializerProvider $serializer */
        $serializer = $this->container->get(SerializerProvider::class);

        $existingTab = $om->getRepository(HomeTab::class)->findOneBy([
            'contextName' => DesktopContext::getName(),
            'name' => 'AI 教学助手',
        ]);

        if ($existingTab) {
            $this->logger->info('AI dashboard tab already exists in desktop context, skipping creation.');

            return;
        }

        $defaultTab = [
            'title' => 'AI 教学助手',
            'longTitle' => 'AI 教学助手',
            'type' => WidgetsTab::getType(),
            'class' => WidgetsTab::class,
            'position' => 1,
            'restrictions' => [
                'hidden' => false,
            ],
            'parameters' => [
                'widgets' => [[
                    'name' => 'AI 教学助手',
                    'visible' => true,
                    'display' => [
                        'layout' => [1],
                        'color' => '#333333',
                        'backgroundType' => 'color',
                        'background' => '#ffffff',
                    ],
                    'parameters' => [],
                    'contents' => [[
                        'type' => 'dashboard',
                        'source' => null,
                        'parameters' => [],
                    ]],
                ]],
            ],
        ];

        $tab = new HomeTab();
        $tab->setContextName(DesktopContext::getName());

        $serializer->deserialize($defaultTab, $tab);

        $om->persist($tab);
        $om->flush();

        $this->logger->info('AI dashboard tab created in desktop context.');
    }
}
