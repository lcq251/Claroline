<?php

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\CoreBundle\Entity\Widget\WidgetContainer;
use Claroline\CoreBundle\Entity\Widget\WidgetContainerConfig;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\HomeBundle\Entity\Type\WidgetsTab;
use Claroline\KernelBundle\Kernel;

require dirname(__DIR__).'/vendor/autoload.php';
require dirname(__DIR__).'/config/bootstrap.php';

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

/** @var ObjectManager $om */
$om = $kernel->getContainer()->get(ObjectManager::class);

// 1. Find Desktop HomeTab
$homeTab = $om->getRepository(HomeTab::class)->findOneBy(['contextName' => 'desktop']);
if (!$homeTab) {
    fwrite(STDERR, "Desktop HomeTab not found.\n");
    exit(1);
}
echo "Found Desktop HomeTab #{$homeTab->getId()}\n";

// 2. Find or create WidgetsTab parameter entity
$widgetsTab = $om->getRepository(WidgetsTab::class)->findOneBy(['tab' => $homeTab]);
if (!$widgetsTab) {
    $widgetsTab = new WidgetsTab();
    $widgetsTab->setTab($homeTab);
    $om->persist($widgetsTab);
    $om->flush();
    echo "Created WidgetsTab entity\n";
}

// 3. Ensure HomeTab.class = WidgetsTab
$homeTab->setClass(WidgetsTab::class);
$om->persist($homeTab);
$om->flush();

// 4. Widget types to seed
$widgetNames = ['dashboard-overview', 'dashboard-workspace-tree', 'dashboard-messages'];
$widgetRepo = $om->getRepository(Widget::class);

foreach ($widgetNames as $name) {
    // Check if already linked
    $alreadyExists = false;
    foreach ($widgetsTab->getWidgetContainers() as $existingContainer) {
        foreach ($existingContainer->getInstances() as $instance) {
            if ($instance->getWidget() && $instance->getWidget()->getName() === $name) {
                $alreadyExists = true;
                echo "Skipped {$name} (already linked)\n";
                break 2;
            }
        }
    }
    if ($alreadyExists) continue;

    // Find widget type
    $widgetType = $widgetRepo->findOneBy(['name' => $name]);
    if (!$widgetType) {
        fwrite(STDERR, "Widget type '{$name}' not found.\n");
        exit(1);
    }

    // Create WidgetInstance
    $instance = new WidgetInstance();
    $instance->setWidget($widgetType);
    $instance->refreshUuid();
    $om->persist($instance);

    // Create WidgetContainer
    $container = new WidgetContainer();
    $container->refreshUuid();
    $container->addInstance($instance);
    $instance->setContainer($container);
    $om->persist($container);

    // Create WidgetContainerConfig
    $config = new WidgetContainerConfig();
    $config->setWidgetContainer($container);
    $config->setName($name);
    $config->setVisible(true);
    $om->persist($config);

    // Link container to WidgetsTab
    $widgetsTab->addWidgetContainer($container);

    echo "Created {$name}: instance #{$instance->getId()}\n";
}

$om->flush();
$kernel->shutdown();
echo "Done.\n";