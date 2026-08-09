<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\HomeBundle\Installation\Updater;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\PublicContext;
use Claroline\CoreBundle\Entity\Plugin;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\HomeBundle\Entity\Type\WidgetsTab;
use Claroline\HomeBundle\Entity\Widget\LandingWidget;
use Claroline\InstallationBundle\Updater\Updater;

/**
 * Seeds the public landing page ("用AI学AI，让学习路上多一个陪伴").
 *
 * Creates a `landing` HomeTab in the public context containing the 5 landing
 * widgets (hero / features / ai / packaging / cta) with their full bilingual
 * copy. The operation is idempotent: if a `landing` tab already exists in the
 * public context it is left untouched.
 *
 * The updater also ensures the landing widgets are registered in the platform
 * widget table (required for the widget parameters to be persisted and for the
 * Home editor to offer them). Fresh installations get them from the plugin
 * config (config.yml), already-installed platforms get them here.
 */
class Updater150101 extends Updater
{
    /**
     * The landing widgets seeded in the public landing tab.
     */
    private const LANDING_WIDGETS = [
        'landing-hero',
        'landing-features',
        'landing-ai',
        'landing-packaging',
        'landing-cta',
    ];

    public function __construct(
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer
    ) {
    }

    public function postUpdate(): void
    {
        $this->ensureLandingWidgets();
        $this->ensureLandingTab();
    }

    /**
     * Registers the 5 landing widgets in the platform widget table if missing.
     */
    private function ensureLandingWidgets(): void
    {
        $homePlugin = $this->om
            ->getRepository(Plugin::class)
            ->findOneBy(['vendorName' => 'Claroline', 'bundleName' => 'HomeBundle']);

        foreach (self::LANDING_WIDGETS as $name) {
            $widget = $this->om
                ->getRepository(Widget::class)
                ->findOneBy(['name' => $name]);

            if ($widget) {
                continue;
            }

            $widget = new Widget();
            $widget->setName($name);
            $widget->setClass(LandingWidget::class);
            $widget->setContext([PublicContext::getName()]);
            $widget->setSources([]);
            $widget->setTags(['content']);
            $widget->setExportable(false);

            if ($homePlugin) {
                $widget->setPlugin($homePlugin);
            }

            $this->om->persist($widget);

            $this->logger?->info(sprintf('Landing widget "%s" registered.', $name));
        }

        $this->om->flush();
    }

    /**
     * Creates the public landing tab (idempotent).
     */
    private function ensureLandingTab(): void
    {
        if ($this->hasLandingTab()) {
            $this->logger?->info('Public landing tab already exists, skipping.');

            return;
        }

        $tab = new HomeTab();
        $tab->setContextName(PublicContext::getName());

        $this->serializer->deserialize($this->getLandingTabData(), $tab);

        $this->om->persist($tab);
        $this->om->flush();

        $this->logger?->info('Public landing tab created with 5 landing widgets.');
    }

    /**
     * Whether a public tab with slug "landing" already exists.
     *
     * The slug is not stored in DB, it is computed from the tab long title
     * (see HomeTabSerializer::serialize()), so the check replicates the same
     * computation.
     */
    private function hasLandingTab(): bool
    {
        $tabs = $this->om
            ->getRepository(HomeTab::class)
            ->findBy(['contextName' => PublicContext::getName()]);

        foreach ($tabs as $tab) {
            if ('landing' === $this->slugify($tab->getLongTitle())) {
                return true;
            }
        }

        return false;
    }

    private function slugify(string $value): string
    {
        return $value
            ? substr(strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $value))), 0, 128)
            : 'new';
    }

    /**
     * Builds the seed data of the public landing tab.
     *
     * Copy is bilingual: the top-level parameters hold the zh primary copy
     * (editable through the widget forms), the `en` block mirrors the complete
     * English copy (rendered for en visitors by the widget components).
     */
    private function getLandingTabData(): array
    {
        return [
            'title' => '首页',
            'longTitle' => 'landing',
            'type' => WidgetsTab::getType(),
            'class' => WidgetsTab::class,
            'position' => 1,
            'restrictions' => [
                'hidden' => false,
            ],
            'parameters' => [
                'widgets' => [
                    $this->getHeroWidgetData(),
                    $this->getFeaturesWidgetData(),
                    $this->getAiWidgetData(),
                    $this->getPackagingWidgetData(),
                    $this->getCtaWidgetData(),
                ],
            ],
        ];
    }

    private function getHeroWidgetData(): array
    {
        return [
            'name' => '首页主视觉',
            'visible' => true,
            'display' => [
                'layout' => [1],
                'color' => '#0f172a',
                'backgroundType' => 'color',
                'background' => '#f8fafc',
            ],
            'contents' => [[
                'type' => 'landing-hero',
                'parameters' => [
                    'title' => '用AI学AI，让学习路上多一个陪伴',
                    'subtitle' => '源自教学的 AI 学习平台 —— 老师工具 · 学生学习方法 · AI 嵌入式平台',
                    // user's original narrative, one character unchanged (D-3 §5);
                    // only the anchor sentence and the open-ending hook carry the
                    // `.em` / `.em-hook` highlight classes (D-3 §2.3)
                    'story' => '<p>2026 年，有人称为<span class="em">AI 元年</span>。国际竞争、资本推动，将使 AI 发展越来越快，AI 会越来越具备人的特征。未来，AI 将替代人大部分工作，而人将通过 AI 工作、生活、社交，将成为常态。<span class="em-hook">我们对待 AI 的态度……</span></p>',
                    'cta' => [
                        ['label' => '登录', 'href' => '/login'],
                        ['label' => '注册', 'href' => '/registration'],
                    ],
                    'stamp' => [
                        'enabled' => true,
                        'text' => '澜之轩工作室',
                    ],
                    // WeChat scan-to-login module (display-only, D-3 §3).
                    // OAuth extension point: when a real WeChat OAuth integration
                    // lands, extend this tree with `wechat.oauth.{appId, redirectUri, scope}`
                    // — the secret stays server-side, never in the widget parameters.
                    'wechat' => [
                        'enabled' => true,
                        // QR placeholder, hosted by the mindme-ai bundle (assets:install)
                        'image' => '/bundles/clarolinemindmeai/images/wechat-qr.png',
                        'title' => '微信扫码登录',
                        'hint' => '打开微信扫一扫，即可登录体验 · 请使用手机微信扫描',
                        'en' => [
                            'title' => 'WeChat Scan to Sign In',
                            'hint' => 'Scan with WeChat to start your experience — use the WeChat app on your phone.',
                        ],
                    ],
                    // complete English copy (rendered by the hero component for en visitors)
                    'en' => [
                        'title' => 'Learn AI with AI — one more companion on your learning journey.',
                        'subtitle' => 'An AI learning platform born from teaching — teacher tools · student learning · AI-embedded platform.',
                        'story' => '<p>2026 — some call it the Year of AI. Driven by international competition and capital, AI will advance faster and faster, growing ever more human-like. In the future, AI will take over most of human work, and working, living, and socializing through AI will become the norm. <span class="em-hook">Our attitude toward AI…</span></p>',
                        'cta' => [
                            ['label' => 'Login', 'href' => '/login'],
                            ['label' => 'Register', 'href' => '/registration'],
                        ],
                    ],
                ],
            ]],
        ];
    }

    private function getFeaturesWidgetData(): array
    {
        return [
            'name' => '核心功能',
            'visible' => true,
            'display' => [
                'layout' => [1],
                'color' => '#0f172a',
                'backgroundType' => 'color',
                'background' => '#f8fafc',
            ],
            'contents' => [[
                'type' => 'landing-features',
                'parameters' => [
                    'title' => '三大块，一个平台',
                    'cards' => [
                        [
                            'num' => '01 · TEACHER',
                            'icon' => 'fa fa-fw fa-chalkboard-teacher',
                            'title' => '为老师提供教学工具',
                            'desc' => '备课、授课、布置、评估，AI 加持提效',
                            'en' => 'Tools for teachers',
                            'href' => '#feature-1',
                            'tone' => 'normal',
                        ],
                        [
                            'num' => '02 · LEARNER',
                            'icon' => 'fa fa-fw fa-graduation-cap',
                            'title' => '为学生提供学习方法',
                            'desc' => '个性化学习路径、AI 助教陪伴、学情反馈',
                            'en' => 'Learning methods',
                            'href' => '#feature-2',
                            'tone' => 'normal',
                        ],
                        [
                            'num' => '03 · PLATFORM',
                            'icon' => 'fa fa-fw fa-cubes',
                            'title' => 'AI 功能嵌入式平台',
                            'desc' => '提供 AI 基座与安全，开箱即用',
                            'en' => 'AI-native platform',
                            'href' => '#feature-3',
                            'tone' => 'dark',
                        ],
                    ],
                    // complete English copy (rendered by the features component for en visitors)
                    'en' => [
                        'title' => 'Three blocks, one platform',
                        'cards' => [
                            ['num' => '01 · TEACHER', 'icon' => 'fa fa-fw fa-chalkboard-teacher', 'title' => 'Tools for teachers', 'desc' => 'Prepare, teach, assign and assess — supercharged by AI', 'href' => '#feature-1', 'tone' => 'normal'],
                            ['num' => '02 · LEARNER', 'icon' => 'fa fa-fw fa-graduation-cap', 'title' => 'Learning methods for students', 'desc' => 'Personalized learning paths, AI companion, progress feedback', 'href' => '#feature-2', 'tone' => 'normal'],
                            ['num' => '03 · PLATFORM', 'icon' => 'fa fa-fw fa-cubes', 'title' => 'AI-native embedded platform', 'desc' => 'AI foundation and security, ready out of the box', 'href' => '#feature-3', 'tone' => 'dark'],
                        ],
                    ],
                ],
            ]],
        ];
    }

    private function getAiWidgetData(): array
    {
        return [
            'name' => 'AI 能力',
            'visible' => true,
            'display' => [
                'layout' => [1],
                'color' => '#0f172a',
                'backgroundType' => 'color',
                'background' => '#f8fafc',
            ],
            'contents' => [[
                'type' => 'landing-ai',
                'parameters' => [
                    'title' => 'AI，嵌入平台每一处',
                    'badge' => 'AI 基座 + 安全 —— 内置模型接入与数据安全底座',
                    'items' => [
                        ['icon' => 'fa fa-fw fa-comments', 'name' => 'AI 助教', 'desc' => '随时答疑，陪伴式学习'],
                        ['icon' => 'fa fa-fw fa-check-circle', 'name' => '自动批改', 'desc' => '主观题智能评分，解放老师'],
                        ['icon' => 'fa fa-fw fa-bolt', 'name' => '内容生成', 'desc' => '摘要、测验、学习路径一键生成'],
                        ['icon' => 'fa fa-fw fa-bullseye', 'name' => '智能推荐', 'desc' => '个性化学习资源推荐'],
                    ],
                    // complete English copy (rendered by the ai component for en visitors)
                    'en' => [
                        'title' => 'AI, embedded everywhere in the platform',
                        'badge' => 'AI foundation + Security — built-in model integration, secure by design',
                        'items' => [
                            ['icon' => 'fa fa-fw fa-comments', 'name' => 'AI Tutor', 'desc' => 'Ask anytime, companion-style learning'],
                            ['icon' => 'fa fa-fw fa-check-circle', 'name' => 'Auto-grading', 'desc' => 'Smart scoring for subjective answers, freeing teachers'],
                            ['icon' => 'fa fa-fw fa-bolt', 'name' => 'Content generation', 'desc' => 'Summaries, quizzes and learning paths in one click'],
                            ['icon' => 'fa fa-fw fa-bullseye', 'name' => 'Smart recommendations', 'desc' => 'Personalized learning resources, tailored to each learner'],
                        ],
                    ],
                ],
            ]],
        ];
    }

    private function getPackagingWidgetData(): array
    {
        return [
            'name' => '打包环境',
            'visible' => true,
            'display' => [
                'layout' => [1],
                'color' => '#0f172a',
                'backgroundType' => 'color',
                'background' => '#f8fafc',
            ],
            'contents' => [[
                'type' => 'landing-packaging',
                'parameters' => [
                    'title' => '一处建设，处处可达',
                    'subtitle' => '平台提供打包环境，一套内容，多端分发',
                    'platforms' => [
                        ['icon' => 'mini', 'name' => '小程序', 'desc' => '轻量即用，随时学习'],
                        ['icon' => 'desktop', 'name' => '桌面', 'desc' => '完整功能，高效教学'],
                        ['icon' => 'app', 'name' => '应用', 'desc' => '移动端随行，处处可学'],
                    ],
                    // complete English copy (rendered by the packaging component for en visitors)
                    'en' => [
                        'title' => 'Build once, reach everywhere',
                        'subtitle' => 'A packaging environment — one set of content, every device',
                        'platforms' => [
                            ['icon' => 'mini', 'name' => 'Mini program', 'desc' => 'Lightweight, learn anytime'],
                            ['icon' => 'desktop', 'name' => 'Desktop', 'desc' => 'Full features, efficient teaching'],
                            ['icon' => 'app', 'name' => 'Mobile app', 'desc' => 'On the go, learn anywhere'],
                        ],
                    ],
                ],
            ]],
        ];
    }

    private function getCtaWidgetData(): array
    {
        return [
            'name' => '行动号召',
            'visible' => true,
            'display' => [
                'layout' => [1],
                'color' => '#ffffff',
                'backgroundType' => 'color',
                'background' => '#115e59',
            ],
            'contents' => [[
                'type' => 'landing-cta',
                'parameters' => [
                    'title' => '学习路上，多一个 AI 伴侣',
                    'subtitle' => '为老师提供工具，为学生提供方法，为学校提供 AI 嵌入式平台',
                    'buttons' => [
                        ['label' => '登录 / 注册', 'href' => '/login', 'primary' => true],
                    ],
                    // complete English copy (rendered by the cta component for en visitors)
                    'en' => [
                        'title' => 'One more AI companion on your learning journey',
                        'subtitle' => 'Tools for teachers, methods for students, an AI-embedded platform for schools.',
                        'buttons' => [
                            ['label' => 'Log in / Register', 'href' => '/login', 'primary' => true],
                        ],
                    ],
                ],
            ]],
        ];
    }
}
