<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\MdhomeBundle\Installation\Updater;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\InstallationBundle\Updater\Updater;

/**
 * mindme-mdhome 温和默认参数（替代 mindme-ai 的 MindmeAiPass 编译期强制写回）。
 *
 * MindmeAiPass 原来在每次容器构建时无条件 setParameter 覆盖平台参数（A1 强制策略）。
 * 本 Updater 只在参数**缺席**时才写入默认值（hasParameter 判断），因此：
 *   - 安装第一次运行时其值生效；
 *   - 管理员后续在平台设置中修改后不会被重置（温和默认）。
 *
 * 对应键均已在 core PlatformDefaults 中有默认值，本 bundle 仅负责在平台尚未
 * 为该部署配置值（platform_options.json 缺失该键）时，落地 mdhome/工作室的默认值。
 */
class UpdaterMdhomeDefaults extends Updater
{
    /**
     * 目标键 => 默认值。
     */
    private const DEFAULTS = [
        'home.type' => 'tool',
        'home.data' => '/#/public/home/default',
        'intl.locale' => 'zh',
        'intl.timezone' => 'Asia/Chongqing',
        'intl.dateFormat' => 'Y-m-d',
        'pricing.enabled' => true,
        'pricing.currency' => 'cny',
        'registration.self' => true,
        'display.name' => '澜之轩工作室',
    ];

    public function __construct(
        private readonly PlatformConfigurationHandler $config
    ) {
    }

    public function postUpdate(): void
    {
        foreach (self::DEFAULTS as $key => $value) {
            // 温和默认：仅当参数尚未设置（platform_options.json 缺席该键）时写入
            if (!$this->config->hasParameter($key)) {
                $this->config->setParameter($key, $value);
            }
        }
    }
}