<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\InstallationBundle\Updater\Updater;
use Claroline\MindMeAiBundle\Entity\Widget\LandingWidget;

/**
 * Refreshes the landing widgets to the C-17 copy & style micro-tune (印章
 * 6 字两排 + features 三卡统一):
 *
 *   hero       stamp.text 「澜之轩」→「澜之轩工作室」(6 字, 与 S1 设计规范一致),
 *              enabled 保留, en.stamp 同步
 *   features   三卡统一新文案 (D4 用户拍板): 卡1 desc「适配工具，辅助教学」/
 *              卡2 标题「个性学习」desc「ai助学，自主可控」/ 卡3 desc「灵感乍现，
 *              嵌入支撑」, tone 全部 normal (去 soft 差异化), en 同步 (D5)
 *
 * Environments already installed keep the C-14/C-16 data, so this updater
 * locates every instance of the two landing widgets and overwrites only the
 * affected parameters (read-modify-write) — the title / subtitle / background
 * / CTA blocks and any admin edits are preserved.
 *
 * The operation is idempotent: each widget is left untouched when its marker
 * already matches (hero: `stamp.text === '澜之轩工作室'`; features:
 * `cards[0].desc === '适配工具，辅助教学'`). Only the hero and features
 * widgets are modified — the ai / packaging / cta instances are never touched.
 */
class Updater150105 extends Updater
{
    /**
     * The widget names handled by this updater.
     */
    private const HERO_WIDGET = 'landing-hero';
    private const FEATURES_WIDGET = 'landing-features';

    /**
     * The 6-char brand carried by the S1 seal (D1 用户拍板).
     */
    private const STAMP_TEXT = '澜之轩工作室';

    /**
     * The C-17 unified features copy (D4 用户拍板, zh primary).
     */
    private const NEW_CARDS = [
        ['icon' => 'fa fa-fw fa-tools', 'title' => 'DIY工具', 'desc' => '适配工具，辅助教学', 'href' => '#feature-1', 'tone' => 'normal'],
        ['icon' => 'fa fa-fw fa-robot', 'title' => '个性学习', 'desc' => 'ai助学，自主可控', 'href' => '#feature-2', 'tone' => 'normal'],
        ['icon' => 'fa fa-fw fa-lightbulb', 'title' => 'Idea展示', 'desc' => '灵感乍现，嵌入支撑', 'href' => '#feature-3', 'tone' => 'normal'],
    ];

    /**
     * The C-17 unified features copy (D5, en block).
     */
    private const NEW_EN_CARDS = [
        ['icon' => 'fa fa-fw fa-tools', 'title' => 'DIY Tools', 'desc' => 'Adaptable tools, assisted teaching', 'href' => '#feature-1', 'tone' => 'normal'],
        ['icon' => 'fa fa-fw fa-robot', 'title' => 'Personalized Learning', 'desc' => 'AI tutoring, self-controlled', 'href' => '#feature-2', 'tone' => 'normal'],
        ['icon' => 'fa fa-fw fa-lightbulb', 'title' => 'Idea Showcase', 'desc' => 'Inspiration sparks, embedded support', 'href' => '#feature-3', 'tone' => 'normal'],
    ];

    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    public function postUpdate(): void
    {
        $this->refreshWidget(self::HERO_WIDGET, fn (array $parameters): array => $this->refreshHero($parameters));
        $this->refreshWidget(self::FEATURES_WIDGET, fn (array $parameters): array => $this->refreshFeatures($parameters));
    }

    /**
     * Refreshes every instance of a landing widget through the given callable.
     * When the callable returns the parameters unchanged (idempotency marker
     * already set) the instance is left untouched.
     */
    private function refreshWidget(string $widgetName, callable $refresh): void
    {
        $widget = $this->om
            ->getRepository(Widget::class)
            ->findOneBy(['name' => $widgetName]);

        if (!$widget) {
            $this->logger?->info(sprintf('Landing widget "%s" not registered, skipping.', $widgetName));

            return;
        }

        $instances = $this->om
            ->getRepository(WidgetInstance::class)
            ->findBy(['widget' => $widget]);

        if (0 === count($instances)) {
            $this->logger?->info(sprintf('No instance of landing widget "%s", skipping.', $widgetName));

            return;
        }

        foreach ($instances as $instance) {
            $config = $this->om
                ->getRepository(LandingWidget::class)
                ->findOneBy(['widgetInstance' => $instance]);

            if (!$config) {
                continue;
            }

            $parameters = $config->getParameters() ?? [];
            $refreshed = $refresh($parameters);

            if ($refreshed === $parameters) {
                $this->logger?->info(sprintf('Landing widget "%s" instance #%s already updated, skipping.', $widgetName, $instance->getId()));

                continue;
            }

            $config->setParameters($refreshed);
            $this->om->persist($config);

            $this->logger?->info(sprintf('Landing widget "%s" instance #%s parameters updated (C-17 copy).', $widgetName, $instance->getId()));
        }

        $this->om->flush();
    }

    /**
     * The C-17 hero stamp refresh: only `stamp.text` (zh + en) is overwritten,
     * `enabled` (and every other key) is preserved. Instances whose stamp text
     * is already the 6-char brand are skipped (idempotent).
     */
    private function refreshHero(array $parameters): array
    {
        if (self::STAMP_TEXT === ($parameters['stamp']['text'] ?? null)) {
            return $parameters;
        }

        // read-modify-write: keep the stored enabled flag (default true when
        // the stamp parameter is missing entirely, matching the C-14 default)
        $stamp = $parameters['stamp'] ?? [];
        $parameters['stamp'] = array_merge(
            ['enabled' => true, 'text' => ''],
            is_array($stamp) ? $stamp : []
        );
        $parameters['stamp']['text'] = self::STAMP_TEXT;

        if (isset($parameters['en']) && is_array($parameters['en'])) {
            $enStamp = $parameters['en']['stamp'] ?? [];
            $parameters['en']['stamp'] = array_merge(
                ['enabled' => true, 'text' => ''],
                is_array($enStamp) ? $enStamp : []
            );
            $parameters['en']['stamp']['text'] = self::STAMP_TEXT;
        }

        return $parameters;
    }

    /**
     * The C-17 features refresh: the three cards (zh + en) are overwritten
     * with the unified copy (all tones normal), the section title / subtitle
     * / background slots are preserved. Instances whose first card desc is
     * already the new copy are skipped (idempotent).
     */
    private function refreshFeatures(array $parameters): array
    {
        if (self::NEW_CARDS[0]['desc'] === ($parameters['cards'][0]['desc'] ?? null)) {
            return $parameters;
        }

        $parameters['cards'] = self::NEW_CARDS;
        $parameters['en']['cards'] = self::NEW_EN_CARDS;

        return $parameters;
    }
}
