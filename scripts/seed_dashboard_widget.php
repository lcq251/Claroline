<?php

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\CoreBundle\Entity\Widget\WidgetContainer;
use Claroline\CoreBundle\Entity\Widget\WidgetContainerConfig;
use Claroline\CoreBundle\Entity\Widget\WidgetInstanceConfig;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\HomeBundle\Entity\Type\WidgetsTab;
use Claroline\KernelBundle\Kernel;

require dirname(__DIR__).'/vendor/autoload.php';
require dirname(__DIR__).'/config/bootstrap.php';

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

/** @var ObjectManager $om */
$om = $kernel->getContainer()->get(ObjectManager::class);

// 1. Find desktop HomeTab
/** @var HomeTab|null $homeTab */
$homeTab = $om->getRepository(HomeTab::class)->findOneBy(['contextName' => 'desktop']);
if (!$homeTab) {
    fwrite(STDERR, "Desktop HomeTab not found.\n");
    exit(1);
}
echo "Found Desktop HomeTab #{$homeTab->getId()}\n";

// 2. Find WidgetsTab
/** @var WidgetsTab|null $widgetsTab */
$widgetsTab = $om->getRepository(WidgetsTab::class)->findOneBy(['tab' => $homeTab]);
if (!$widgetsTab) {
    fwrite(STDERR, "WidgetsTab not found for HomeTab.\n");
    exit(1);
}

// 3. Ensure HomeTab class = WidgetsTab
$homeTab->setClass(WidgetsTab::class);
$om->persist($homeTab);
$om->flush();

// 4. Seed each widget
$widgetNames = ['dashboard-overview', 'dashboard-workspace-tree', 'dashboard-messages', 'dashboard-recommendations'];
$widgetRepo = $om->getRepository(Widget::class);

foreach ($widgetNames as $name) {
    // Dedup: check if already linked
    $found = false;
    foreach ($widgetsTab->getWidgetContainers() as $container) {
        foreach ($container->getInstances() as $instance) {
            if ($instance->getWidget() && $instance->getWidget()->getName() === $name) {
                $found = true;
                echo "Skipped {$name} (already linked via container #{$container->getId()})\n";
                break 2;
            }
        }
    }
    if ($found) continue;

    // Find widget type (from DB, must exist after cache:clear)
    $widgetType = $widgetRepo->findOneBy(['name' => $name]);
    if (!$widgetType) {
        fwrite(STDERR, "Widget type '{$name}' not found in DB.\n");
        exit(1);
    }

    // Create WidgetInstance
    $instance = new WidgetInstance();
    $instance->setWidget($widgetType);
    $instance->refreshUuid();
    $om->persist($instance);

    // Create WidgetInstanceConfig (content slot so the widget renders, type=widget name)
    $instConfig = new WidgetInstanceConfig();
    $instConfig->setWidgetInstance($instance);
    $instConfig->setType($name);
    $instConfig->setWidgetOrder(0);
    $om->persist($instConfig);

    // Create WidgetContainer
    $container = new WidgetContainer();
    $container->refreshUuid();
    $container->addInstance($instance);
    $om->persist($container);

    // Create WidgetContainerConfig (with bidirectional links)
    $config = new WidgetContainerConfig();
    $config->setName($name);
    $config->setVisible(true);
    $config->setLayout([1]);
    $config->setWidgetContainer($container);
    $container->addWidgetContainerConfig($config);
    $om->persist($config);

    // Link to WidgetsTab
    $widgetsTab->addWidgetContainer($container);
    
    echo "Created {$name}: instance #{$instance->getId()}, container #{$container->getId()}\n";
}

$om->flush();
$kernel->shutdown();
echo "Done.\n";
