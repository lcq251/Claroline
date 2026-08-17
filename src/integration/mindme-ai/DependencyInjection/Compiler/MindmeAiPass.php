<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\DependencyInjection\Compiler;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/**
 * Forces the platform default parameters on every container build (A1 强制策略,
 * C-15 用户拍板 2026-08-10):
 *
 *   home.type         = tool
 *   intl.locale       = zh
 *   intl.timezone     = Asia/Shanghai
 *   intl.dateFormat   = Y-m-d
 *   pricing.enabled   = true
 *   pricing.currency  = rmb
 *
 * Implemented as a compiler pass (参照 src/main/core/DependencyInjection/
 * Compiler/PlatformConfigPass.php 的 addMethodCall 模式): during the container
 * compilation the handler definition gets one setParameter() method call per
 * target key, executed when the service is instantiated — writing through
 * PlatformConfigurationHandler::setParameter() into files/config/
 * platform_options.json (点路径 → ArrayUtils::set → saveParameters).
 *
 * Semantics (A1, 强制): every container build re-applies the frozen values,
 * even when an administrator has changed them afterwards. The key structure
 * mirrors src/main/core/Configuration/PlatformDefaults.php.
 *
 * The operation is naturally idempotent: setParameter() unconditionally
 * overwrites the value, so re-running the build is harmless.
 */
class MindmeAiPass implements CompilerPassInterface
{
    private const TARGET = [
        'home.type' => 'tool',
        'home.data' => '/#/public/home/default',
        'intl.locale' => 'zh',
        'intl.timezone' => 'Asia/Shanghai',
        'intl.dateFormat' => 'Y-m-d',
        'pricing.enabled' => true,
        'pricing.currency' => 'RMB',
        'registration.self'=>true,
        'registration.allow_workspace'=>true
    ];


    public function process(ContainerBuilder $container): void
    {
        if (false === $container->hasDefinition(PlatformConfigurationHandler::class)) {
            return;
        }

        $configHandler = $container->getDefinition(PlatformConfigurationHandler::class);

        foreach (self::TARGET as $key => $value) {
            $configHandler->addMethodCall('setParameter', [$key, $value]);
        }
    }
}
