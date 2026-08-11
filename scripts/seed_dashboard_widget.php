<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*
 * Idempotent seeding of the 5 desktop dashboard widgets (C-22, spec §9.3).
 *
 * 1. Registers the 5 widget definitions (claro_widget) if they are missing
 *    (an already-installed plugin does not pick up new config.yml entries).
 * 2. Mounts the 5 widget containers at the HEAD of the desktop HomeTab
 *    widgets[] list, in D9 order:
 *        board → recommendations → notifications → shortcuts → fees
 *    keeping the existing `my_workspaces` block below them.
 * 3. Writes the §4 default parameters (incl. the 3 recommendation examples
 *    and the 4 default shortcuts, bilingual: zh flat + `en` keys).
 * 4. D10: writes the demo fallback rows into already-mounted widgets whose
 *    parameters lack them — `messages` (notifications) and `fees` — so an
 *    existing instance gets the demo data without a new container.
 *
 * When no desktop tab exists yet it is created following the
 * LoadDesktopHomeData structure (title = platform translation `information`).
 *
 * Usage (inside the app container, as www-data):
 *   php scripts/seed_dashboard_widget.php
 *
 * Safe to run multiple times: existing dashboard instances are detected
 * through the serialized tab, demo parameters are only filled when missing
 * (admin edits are never overwritten).
 */

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Entity\Plugin;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\HomeBundle\Entity\Type\WidgetsTab;
use Claroline\KernelBundle\Kernel;
use Claroline\MindMeAiBundle\Entity\Widget\LandingWidget;
use Symfony\Contracts\Translation\TranslatorInterface;

require dirname(__DIR__).'/vendor/autoload.php';
require dirname(__DIR__).'/config/bootstrap.php';

/**
 * The 5 dashboard widgets in their D9 mount order.
 */
const DASHBOARD_WIDGETS = [
    'dashboard-board',
    'dashboard-recommendations',
    'dashboard-notifications',
    'dashboard-shortcuts',
    'dashboard-fees',
];

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

/** @var ObjectManager $om */
$om = $kernel->getContainer()->get(ObjectManager::class);
/** @var SerializerProvider $serializer */
$serializer = $kernel->getContainer()->get(SerializerProvider::class);
/** @var TranslatorInterface $translator */
$translator = $kernel->getContainer()->get('translator');

ensureWidgetDefinitions($om);
seedDashboardTab($om, $serializer, $translator);

$kernel->shutdown();

/**
 * Registers the 5 dashboard widgets in claro_widget if missing.
 *
 * Fresh installations get them from the plugin config (config.yml);
 * already-installed platforms need the rows here (same pattern as the
 * removed landing Updater150100::ensureLandingWidgets).
 */
function ensureWidgetDefinitions(ObjectManager $om): void
{
    $plugin = $om->getRepository(Plugin::class)->findOneBy([
        'vendorName' => 'Claroline',
        'bundleName' => 'MindMeAiBundle',
    ]);

    foreach (DASHBOARD_WIDGETS as $name) {
        $widget = $om->getRepository(Widget::class)->findOneBy(['name' => $name]);

        if ($widget) {
            continue;
        }

        $widget = new Widget();
        $widget->setName($name);
        $widget->setClass(LandingWidget::class);
        $widget->setContext([DesktopContext::getName()]);
        $widget->setSources([]);
        $widget->setTags(['content']);
        $widget->setExportable(false);

        if ($plugin) {
            $widget->setPlugin($plugin);
        }

        $om->persist($widget);

        echo "Registered widget definition {$name}\n";
    }

    $om->flush();
}

/**
 * Mounts the 5 dashboard widgets at the head of the desktop HomeTab.
 */
function seedDashboardTab(ObjectManager $om, SerializerProvider $serializer, TranslatorInterface $translator): void
{
    $tabs = $om->getRepository(HomeTab::class)->findBy([
        'contextName' => DesktopContext::getName(),
    ]);

    if (empty($tabs)) {
        // no desktop tab: build the LoadDesktopHomeData default structure
        $tab = new HomeTab();
        $tab->setContextName(DesktopContext::getName());

        $tabData = [
            'title' => $translator->trans('information', [], 'platform'),
            'longTitle' => $translator->trans('information', [], 'platform'),
            'slug' => 'information',
            'type' => WidgetsTab::getType(),
            'class' => WidgetsTab::class,
            'position' => 1,
            'restrictions' => [
                'hidden' => false,
            ],
            'parameters' => [
                'widgets' => array_merge(
                    dashboardWidgetData($translator),
                    [myWorkspacesWidgetData($translator)]
                ),
            ],
        ];

        $serializer->deserialize($tabData, $tab);
        $om->persist($tab);
        $om->flush();

        echo "Desktop HomeTab created with 5 dashboard widgets (my_workspaces kept below).\n";

        return;
    }

    // existing tab: serialize → prepend missing dashboard widgets + fill demo
    // parameters → deserialize (editor save flow: existing containers are
    // matched by their ids)
    $tab = $tabs[0];
    $tabData = $serializer->serialize($tab);

    $existing = existingDashboardWidgets($tabData);

    $toInsert = [];
    foreach (DASHBOARD_WIDGETS as $name) {
        if (!isset($existing[$name])) {
            $toInsert[] = dashboardWidgetData($translator, $name);
        }
    }

    $changed = !empty($toInsert);

    if ($changed) {
        $tabData['parameters']['widgets'] = array_merge(
            $toInsert,
            $tabData['parameters']['widgets']
        );
    }

    // D10: fill the demo fallback rows (messages/fees) into already-mounted
    // widgets whose parameters lack them — idempotent, never overwrites
    // admin edits, never duplicates containers
    $changed = ensureDemoParameters($tabData) || $changed;

    if (!$changed) {
        echo "Dashboard widgets already mounted and demo parameters up to date.\n";

        return;
    }

    $serializer->deserialize($tabData, $tab);
    $om->persist($tab);
    $om->flush();

    if (!empty($toInsert)) {
        $names = array_map(function (array $widgetData) {
            return $widgetData['contents'][0]['type'];
        }, $toInsert);

        echo 'Mounted dashboard widgets at head of desktop HomeTab: '.implode(', ', $names)."\n";
    } else {
        echo "Demo fallback rows (messages/fees) written into existing dashboard widgets.\n";
    }
}

/**
 * Returns the names of the dashboard widgets already mounted in a tab.
 *
 * @return array<string, true>
 */
function existingDashboardWidgets(array $tabData): array
{
    $existing = [];

    foreach ($tabData['parameters']['widgets'] ?? [] as $widgetContainerData) {
        foreach ($widgetContainerData['contents'] ?? [] as $content) {
            if (isset($content['type']) && in_array($content['type'], DASHBOARD_WIDGETS, true)) {
                $existing[$content['type']] = true;
            }
        }
    }

    return $existing;
}

/**
 * D10: writes the demo fallback rows into already-mounted widgets whose
 * parameters lack them.
 *
 * Only fills the key when it is absent — an admin-edited list (even an
 * emptied one) is never overwritten. Also strips the runtime `data` key
 * (injected by the dashboard serializer at serialize time) so the
 * deserialize round-trip does not persist a stale CLI snapshot into the
 * instance parameters. Returns whether anything changed.
 */
function ensureDemoParameters(array &$tabData): bool
{
    if (!isset($tabData['parameters']['widgets']) || !is_array($tabData['parameters']['widgets'])) {
        return false;
    }

    $changed = false;

    foreach ($tabData['parameters']['widgets'] as &$container) {
        if (!isset($container['contents']) || !is_array($container['contents'])) {
            continue;
        }

        foreach ($container['contents'] as &$content) {
            if (!is_array($content)) {
                continue;
            }

            $type = $content['type'] ?? '';

            if (!in_array($type, DASHBOARD_WIDGETS, true)) {
                continue;
            }

            $demoKey = match ($type) {
                'dashboard-notifications' => 'messages',
                'dashboard-fees' => 'fees',
                default => null,
            };

            $parameters = $content['parameters'] ?? [];

            // never persist the serializer's runtime snapshot
            unset($parameters['data']);

            if (null !== $demoKey && !array_key_exists($demoKey, $parameters)) {
                $parameters[$demoKey] = dashboardDefaultParameters($type)[$demoKey];
                $changed = true;
            }

            $content['parameters'] = $parameters;
        }
        unset($content);
    }
    unset($container);

    return $changed;
}

/**
 * Builds the widget container data of one dashboard widget (or all of them
 * when $name is null).
 *
 * The container display name is hardcoded zh (landing seed precedent):
 * the CLI seed runs with the default en locale and `trans()` would write
 * English block headings on the zh-configured platform.
 *
 * @return array<mixed>|array<int, array<mixed>>
 */
function dashboardWidgetData(TranslatorInterface $translator, ?string $name = null): array
{
    if (null === $name) {
        return array_map(function (string $widgetName) use ($translator) {
            return dashboardWidgetData($translator, $widgetName);
        }, DASHBOARD_WIDGETS);
    }

    $containerNames = [
        'dashboard-board' => '看板',
        'dashboard-recommendations' => '产品推荐',
        'dashboard-notifications' => '消息提醒',
        'dashboard-shortcuts' => '快捷方式',
        'dashboard-fees' => '费用表况',
    ];

    return [
        'name' => $containerNames[$name] ?? $translator->trans($name, [], 'widget'),
        'visible' => true,
        'display' => [
            'layout' => [1],
            'color' => '#333333',
            'backgroundType' => 'color',
            'background' => '#ffffff',
        ],
        'contents' => [[
            'type' => $name,
            'parameters' => dashboardDefaultParameters($name),
        ]],
    ];
}

/**
 * §4 default parameters of each dashboard widget (spec 04-widget-parameters
 * §4.1 + §3.2 recommendation examples + §3.4/§5.7 shortcuts).
 *
 * @return array<string, mixed>
 */
function dashboardDefaultParameters(string $name): array
{
    return match ($name) {
        'dashboard-board' => [
            'showEmptyHint' => true,
        ],
        'dashboard-recommendations' => [
            'showLikes' => true,
            'items' => [
                [
                    'id' => 'rec-1',
                    'title' => 'AI 辅助教学入门手册',
                    'desc' => '把大模型接进备课、出题与课堂互动的操作指南。',
                    'cover' => null,
                    'type' => 'resource',
                    'tag' => 'teacher',
                    'by' => '王老师',
                    'when' => '2 天前',
                    'likes' => 0,
                    'url' => '#/desktop/resources',
                    'en' => [
                        'title' => 'AI-Assisted Teaching Starter Guide',
                        'desc' => 'A practical guide to integrating LLMs into lesson prep, quizzes and classroom interaction.',
                    ],
                ],
                [
                    'id' => 'rec-2',
                    'title' => '高效备课模板集',
                    'desc' => '教案、学案、周测三件套模板，随取随改。',
                    'cover' => null,
                    'type' => 'template',
                    'tag' => 'teacher',
                    'by' => '李老师',
                    'when' => '上周',
                    'likes' => 0,
                    'url' => '#/desktop/resources',
                    'en' => [
                        'title' => 'Lesson Prep Template Kit',
                        'desc' => 'Lesson plans, study sheets and weekly quiz templates, ready to adapt.',
                    ],
                ],
                [
                    'id' => 'rec-3',
                    'title' => 'Python 数据分析实战',
                    'desc' => '从数据清洗到可视化，8 周带练真实项目。',
                    'cover' => null,
                    'type' => 'course',
                    'tag' => 'platform',
                    'by' => '运营精选',
                    'when' => '本周',
                    'likes' => 0,
                    'url' => '#/desktop/catalog',
                    'en' => [
                        'title' => 'Python Data Analysis in Practice',
                        'desc' => 'From cleaning to visualization: an 8-week project-driven course.',
                    ],
                ],
            ],
        ],
        'dashboard-notifications' => [
            'maxItems' => 3,
            'showDescription' => true,
            // D10 demo fallback rows: rendered only when the serializer has
            // no real messages (frontend data-first contract)
            'messages' => [
                [
                    'id' => 'msg-1',
                    'title' => '「数据结构与算法」明天 14:00 开课',
                    'description' => '课程将于汇学楼 B 座 203 开讲，请提前 10 分钟到场签到。',
                    'type' => 'course',
                    'unread' => true,
                    'time' => '2026-08-11T02:30:00+08:00',
                    'url' => '#/desktop/catalog',
                ],
                [
                    'id' => 'msg-2',
                    'title' => '本周线下研讨课地点已变更',
                    'description' => '地点：汇学楼 B 座 203',
                    'type' => 'location',
                    'unread' => true,
                    'time' => '2026-08-10T09:15:00+08:00',
                    'url' => '#/desktop/trainings',
                ],
                [
                    'id' => 'msg-3',
                    'title' => '《Python 数据分析实战》第 2 周作业已发布',
                    'description' => '截止时间：本周五 23:59，请在课程页提交。',
                    'type' => 'assignment',
                    'unread' => false,
                    'time' => '2026-08-09T18:00:00+08:00',
                    'url' => '#/desktop/trainings',
                ],
            ],
        ],
        'dashboard-shortcuts' => [
            'items' => [
                ['label' => '空间列表', 'en' => 'Workspaces', 'icon' => 'fa fa-fw fa-archive', 'url' => '#/desktop/workspaces'],
                ['label' => '资源列表', 'en' => 'Resources', 'icon' => 'fa fa-fw fa-book', 'url' => '#/desktop/resources'],
                ['label' => '课程列表', 'en' => 'Courses', 'icon' => 'fa fa-fw fa-graduation-cap', 'url' => '#/desktop/catalog'],
                ['label' => '课程进度', 'en' => 'Progress', 'icon' => 'fa fa-fw fa-chart-line', 'url' => '#/desktop/trainings'],
            ],
        ],
        'dashboard-fees' => [
            'maxItems' => 3,
            // D10 demo fallback rows: rendered only when the serializer has
            // no real fees (frontend data-first contract)
            'fees' => [
                [
                    'course' => '「AI 入门」春季班',
                    'price' => 299,
                    'currency' => 'CNY',
                    'status' => 'open',
                    'url' => '#/desktop/catalog',
                ],
                [
                    'course' => '「数据结构与算法」',
                    'price' => 199,
                    'currency' => 'CNY',
                    'status' => 'started',
                    'url' => '#/desktop/catalog',
                ],
                [
                    'course' => '「Python 数据分析实战」',
                    'price' => 399,
                    'currency' => 'CNY',
                    'status' => 'soon',
                    'url' => '#/desktop/catalog',
                ],
            ],
        ],
        default => [],
    };
}

/**
 * The `my_workspaces` block kept below the dashboard widgets
 * (LoadDesktopHomeData structure).
 *
 * @return array<mixed>
 */
function myWorkspacesWidgetData(TranslatorInterface $translator): array
{
    return [
        'name' => $translator->trans('my_workspaces', [], 'workspace'),
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
    ];
}
