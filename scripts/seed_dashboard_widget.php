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

// 1. Find desktop HomeTab
$homeTab = $om->getRepository(HomeTab::class)->findOneBy(['contextName' => 'desktop']);
if (!$homeTab) {
    fwrite(STDERR, "Desktop HomeTab not found.\n");
    exit(1);
}
echo "Found Desktop HomeTab #{$homeTab->getId()}\n";

// 2. Find or create WidgetsTab
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

// 4. Seed each widget
$widgetNames = ['dashboard-overview', 'dashboard-workspace-tree', 'dashboard-messages'];
$widgetRepo = $om->getRepository(Widget::class);

foreach ($widgetNames as $name) {
    // Dedup: check if already linked
    $found = false;
    foreach ($widgetsTab->getWidgetContainers() as $c) {
        foreach ($c->getInstances() as $inst) {
            if ($inst->getWidget() && $inst->getWidget()->getName() === $name) {
                $found = true;
                echo "Skipped {$name} (already linked via container #{$c->getId()})\n";
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

    // Create WidgetContainerConfig
    $config = new WidgetContainerConfig();
    $config->setName($name);
    $config->setVisible(true);
    $config->setWidgetInstance($instance);
    $om->persist($config);

    // Create WidgetContainer
    $container = new WidgetContainer();
    $container->refreshUuid();
    $container->addInstance($instance);
    $om->persist($container);

    // Link to WidgetsTab
    $widgetsTab->addWidgetContainer($container);

    echo "Created {$name}: instance #{$instance->getId()}, container #{$container->getId()}\n";
}

$om->flush();
$kernel->shutdown();
echo "Done.\n";