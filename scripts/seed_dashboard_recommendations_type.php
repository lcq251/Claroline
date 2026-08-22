<?php

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Plugin;
use Claroline\KernelBundle\Kernel;

require dirname(__DIR__).'/vendor/autoload.php';
require dirname(__DIR__).'/config/bootstrap.php';

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

/** @var ObjectManager $om */
$om = $kernel->getContainer()->get(ObjectManager::class);

// Find plugin (MindMeAiBundle)
/** @var Plugin|null $plugin */
$plugin = $om->getRepository(Plugin::class)->findOneBy(['bundleName' => 'MindMeAiBundle']);

if (!$plugin) {
    fwrite(STDERR, "Plugin 'MindMeAiBundle' not found.\n");
    exit(1);
}

echo "Found plugin #{$plugin->getId()} (MindMeAiBundle)\n";

// Find or create Widget
$widgetRepo = $om->getRepository(Widget::class);
/** @var Widget|null $widget */
$widget = $widgetRepo->findOneBy(['name' => 'dashboard-recommendations']);

if (!$widget) {
    echo "Creating Widget 'dashboard-recommendations'...\n";
    $widget = new Widget();
    $widget->setName('dashboard-recommendations');
    $widget->setClass(\Claroline\MindMeAiBundle\Entity\Widget\LandingWidget::class);
    $widget->setPlugin($plugin);
    $widget->setContext(['desktop']);
    $widget->setTags(['content']);
    $widget->setSources([]);
    $widget->setExportable(false);
    $widget->refreshUuid();

    $om->persist($widget);
    $om->flush();

    echo "Created Widget #{$widget->getId()} (dashboard-recommendations)\n";
} else {
    echo "Widget 'dashboard-recommendations' already exists (#{$widget->getId()})\n";
}

$kernel->shutdown();
