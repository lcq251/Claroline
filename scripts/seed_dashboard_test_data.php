<?php

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\KernelBundle\Kernel;
use Claroline\MindMeAiBundle\Entity\Widget\LandingWidget;

require dirname(__DIR__).'/vendor/autoload.php';
require dirname(__DIR__).'/config/bootstrap.php';

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

/** @var ObjectManager $om */
$om = $kernel->getContainer()->get(ObjectManager::class);

$widgetNames = ['dashboard-workspace-tree', 'dashboard-messages', 'dashboard-recommendations'];

$demo = [
    'dashboard-workspace-tree' => [
        // 双语演示：中文平铺 + en 键
        'tree' => [
            ['id' => 'ws1', 'name' => '我的工作空间', 'code' => 'ws1', 'url' => '#/workspace/ws1', 'resources' => [
                ['id' => 'r1', 'name' => '课程大纲', 'type' => 'text', 'url' => '#'],
                ['id' => 'r2', 'name' => '学习资料', 'type' => 'text', 'url' => '#'],
            ]],
            ['id' => 'ws2', 'name' => '协作项目A', 'code' => 'ws2', 'url' => '#/workspace/ws2', 'resources' => [
                ['id' => 'r3', 'name' => '项目计划', 'type' => 'text', 'url' => '#'],
                ['id' => 'r4', 'name' => '会议记录', 'type' => 'text', 'url' => '#'],
            ]],
            ['id' => 'ws3', 'name' => '实验班', 'code' => 'ws3', 'url' => '#/workspace/ws3', 'resources' => [
                ['id' => 'r5', 'name' => '实验手册', 'type' => 'text', 'url' => '#'],
                ['id' => 'r6', 'name' => '实验报告模板', 'type' => 'text', 'url' => '#'],
            ]],
        ],
        'maxResources' => 5,
        'en' => [
            'tree' => [
                ['id' => 'ws1', 'name' => 'My Workspace', 'code' => 'ws1', 'url' => '#/workspace/ws1', 'resources' => [
                    ['id' => 'r1', 'name' => 'Course Outline', 'type' => 'text', 'url' => '#'],
                    ['id' => 'r2', 'name' => 'Study Materials', 'type' => 'text', 'url' => '#'],
                ]],
                ['id' => 'ws2', 'name' => 'Project A', 'code' => 'ws2', 'url' => '#/workspace/ws2', 'resources' => [
                    ['id' => 'r3', 'name' => 'Project Plan', 'type' => 'text', 'url' => '#'],
                    ['id' => 'r4', 'name' => 'Meeting Notes', 'type' => 'text', 'url' => '#'],
                ]],
                ['id' => 'ws3', 'name' => 'Lab Class', 'code' => 'ws3', 'url' => '#/workspace/ws3', 'resources' => [
                    ['id' => 'r5', 'name' => 'Lab Manual', 'type' => 'text', 'url' => '#'],
                    ['id' => 'r6', 'name' => 'Report Template', 'type' => 'text', 'url' => '#'],
                ]],
            ],
            'maxResources' => 5,
        ],
    ],
    'dashboard-messages' => [
        'messages' => [
            ['id' => 'm1', 'title' => '系统升级通知', 'body' => '今晚 23:00-02:00 平台进行维护升级，请提前保存。', 'date' => '2026-08-23T18:00:00+08:00', 'read' => false, 'url' => '#'],
            ['id' => 'm2', 'title' => '新课程已发布', 'body' => '《AI 基础入门》课程已上架，快去看看吧！', 'date' => '2026-08-22T10:30:00+08:00', 'read' => false, 'url' => '#'],
            ['id' => 'm3', 'title' => '作业截止提醒', 'body' => '本周作业将在周五提交截止，请注意时间。', 'date' => '2026-08-21T09:00:00+08:00', 'read' => true, 'url' => '#'],
        ],
        'en' => [
            'messages' => [
                ['id' => 'm1', 'title' => 'System Upgrade Notice', 'body' => 'Maintenance tonight 23:00-02:00, please save in advance.', 'date' => '2026-08-23T18:00:00+08:00', 'read' => false, 'url' => '#'],
                ['id' => 'm2', 'title' => 'New Course Published', 'body' => 'The "AI Fundamentals" course is now live!', 'date' => '2026-08-22T10:30:00+08:00', 'read' => false, 'url' => '#'],
                ['id' => 'm3', 'title' => 'Homework Deadline', 'body' => 'This week homework is due Friday.', 'date' => '2026-08-21T09:00:00+08:00', 'read' => true, 'url' => '#'],
            ],
        ],
    ],
    'dashboard-recommendations' => [
        'recommendations' => [
            ['id' => 'rec1', 'type' => 'course', 'title' => 'AI 基础入门', 'desc' => '零基础入门人工智能，含实战项目。', 'url' => '#'],
            ['id' => 'rec2', 'type' => 'resource', 'title' => '机器学习笔记精选', 'desc' => '精选论文笔记与代码示例。', 'url' => '#'],
            ['id' => 'rec3', 'type' => 'course', 'title' => 'Python 数据分析实战', 'desc' => '从数据清洗到可视化分析。', 'url' => '#'],
            ['id' => 'rec4', 'type' => 'resource', 'title' => '编程题题库', 'desc' => '覆盖常用算法与数据结构。', 'url' => '#'],
        ],
        'en' => [
            'recommendations' => [
                ['id' => 'rec1', 'type' => 'course', 'title' => 'AI Fundamentals', 'desc' => 'Beginner AI with hands-on projects.', 'url' => '#'],
                ['id' => 'rec2', 'type' => 'resource', 'title' => 'ML Notes Selection', 'desc' => 'Selected paper notes and code examples.', 'url' => '#'],
                ['id' => 'rec3', 'type' => 'course', 'title' => 'Python Data Analysis', 'desc' => 'From data cleaning to visualization.', 'url' => '#'],
                ['id' => 'rec4', 'type' => 'resource', 'title' => 'Coding Exercise Bank', 'desc' => 'Covers common algorithms and data structures.', 'url' => '#'],
            ],
        ],
    ],
];

$widgetRepo  = $om->getRepository(Widget::class);
$instanceRepo = $om->getRepository(WidgetInstance::class);
$landingRepo  = $om->getRepository(LandingWidget::class);

foreach ($widgetNames as $name) {
    $widgetType = $widgetRepo->findOneBy(['name' => $name]);
    if (!$widgetType) {
        fwrite(STDERR, "Widget type '{$name}' not found in DB. Did you cache:clear after adding config.yml?\n");
        exit(1);
    }

    // find the already-mounted widget instance (each of these 3 widgets is mounted once)
    $instance = $instanceRepo->findOneBy(['widget' => $widgetType]);
    if (!$instance) {
        fwrite(STDERR, "No WidgetInstance mounted for '{$name}' yet. Run seed_dashboard_widget.php first.\n");
        exit(1);
    }

    // find-or-create the LandingWidget parameter row for this widget instance
    $landing = $landingRepo->findOneBy(['widgetInstance' => $instance]);
    if ($landing) {
        $landing->setParameters($demo[$name]);
        $om->persist($landing);
        echo "Updated demo parameters for {$name} (instance #{$instance->getId()})\n";
    } else {
        $landing = new LandingWidget();
        $landing->setWidgetInstance($instance);
        $landing->setParameters($demo[$name]);
        $om->persist($landing);
        echo "Created demo parameters for {$name} (instance #{$instance->getId()})\n";
    }
}

$om->flush();
$kernel->shutdown();
echo "Done.\n";