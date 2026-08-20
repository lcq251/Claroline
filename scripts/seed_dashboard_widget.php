<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Idempotent seeding of the mindme-ai desktop dashboard widgets.
 *
 * Creates widget instances for dashboard-overview, dashboard-workspace-tree,
 * and dashboard-messages, then places them on the Desktop home tab.
 *
 * Usage (inside the app container, as www-data):
 *   php scripts/seed_dashboard_widget.php
 *
 * Safe to run multiple times: checks if instance exists before creating.
 */

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\KernelBundle\Kernel;

require dirname(__DIR__).'/vendor/autoload.php';
require dirname(__DIR__).'/config/bootstrap.php';

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

/** @var ObjectManager $om */
$om = $kernel->getContainer()->get(ObjectManager::class);

// Find the Desktop home tab
$homeTab = $om->getRepository(HomeTab::class)->findOneBy(['type' => 'desktop']);

if (!$homeTab) {
    fwrite(STDERR, "Desktop home tab not found. Has the platform been installed?\n");
    exit(1);
}

// Widget types we want to seed
$widgetNames = [
    'dashboard-overview',
    'dashboard-workspace-tree',
    'dashboard-messages',
];

// Get existing widget instances already on the Desktop tab
$existingInstanceIds = [];
$existingConnections = $om->getConnection()->fetchAllAssociative(
    'SELECT w.name, htw.widgetInstance_id FROM claro_home_tab_widgets htw '.
    'JOIN claro_widget_instance wi ON htw.widgetInstance_id = wi.id '.
    'JOIN claro_widget w ON wi.widget_id = w.id '.
    'WHERE htw.homeTab_id = ?',
    [$homeTab->getId()]
);
$existingByName = [];
foreach ($existingConnections as $conn) {
    $existingByName[$conn['name']] = $conn['widgetInstance_id'];
}

$widgetRepo = $om->getRepository(Widget::class);
$order = count($existingConnections) + 1; // append after existing widgets

foreach ($widgetNames as $name) {
    if (isset($existingByName[$name])) {
        echo "Skipped {$name} (instance #{$existingByName[$name]} already on Desktop tab)\n";
        continue;
    }

    // Find widget type
    $widgetType = $widgetRepo->findOneBy(['name' => $name]);
    if (!$widgetType) {
        fwrite(STDERR, "Widget type '{$name}' not found. Has claroline:plugin:install been run?\n");
        exit(1);
    }

    // Create instance
    $instance = new WidgetInstance();
    $instance->setName($name);
    $instance->setWidget($widgetType);
    $instance->refreshUuid();

    $om->persist($instance);
    $om->flush(); // flush to get the id

    // Link to Desktop home tab
    $connection = $om->getConnection();
    $connection->insert('claro_home_tab_widgets', [
        'homeTab_id'       => $homeTab->getId(),
        'widgetInstance_id' => $instance->getId(),
        'widgetOrder'      => $order++,
    ]);

    echo "Created {$name} instance #{$instance->getId()} and placed on Desktop tab\n";
}

$kernel->shutdown();
echo "Done.\n";