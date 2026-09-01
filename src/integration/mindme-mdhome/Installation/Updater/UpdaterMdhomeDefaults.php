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
 * mindme-mdhome 强制默认参数（替代 mindme-ai 的 MindmeAiPass 编译期强制写回）。
 *
 * 管理员选择“强制覆盖”：每次运行本更新器（plugin 安装/升级时由
 * claroline.platform.updater 触发）都会把这些键写入 platform_options.json，
 * 覆盖任何既有值。这与温和默认的区别是：不判断 hasParameter，始终把 mdhome
 * 主张的值落地到参数文件（PlatformConfigurationHandler::setParameter 最终
 * saveParameters() → file_put_contents 写文件）。
 */
class UpdaterMdhomeDefaults extends Updater
{
    /**
     * 目标键 => 默认值。安装时将全部强制写入 platform_options.json。
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
        'display.theme' => 'mindme',
    ];

    public function __construct(
        private readonly PlatformConfigurationHandler $config
    ) {
    }

    public function postUpdate(): void
    {
        foreach (self::DEFAULTS as $key => $value) {
            // 强制覆盖：无论当前值如何，都写入配置文件
            $this->config->setParameter($key, $value);
        }
    }
}