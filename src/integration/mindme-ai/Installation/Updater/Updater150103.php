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

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\InstallationBundle\Updater\Updater;

/**
 * Forces the platform default parameters on every install (C-15, A1 强制策略):
 *
 *   home.type         = tool
 *   intl.locale       = zh
 *   intl.timezone     = Asia/Shanghai
 *   intl.dateFormat   = Y-m-d
 *   pricing.enabled   = true
 *   pricing.currency  = rmb
 *
 * The user decided (2026-08-10) that the fork must ship out-of-the-box with a
 * Chinese locale, Shanghai timezone, the tools home page and RMB pricing —
 * even when an administrator has changed them afterwards (A1: every updater
 * run re-writes the target values). The key structure mirrors
 * src/main/core/Configuration/PlatformDefaults.php.
 *
 * The operation is naturally idempotent: setParameter() unconditionally
 * overwrites the value, so re-running the updater is harmless and re-applies
 * the frozen configuration.
 */
class Updater150103 extends Updater
{
    private const TARGET = [
        'home.type' => 'tool',
        'intl.locale' => 'zh',
        'intl.timezone' => 'Asia/Shanghai',
        'intl.dateFormat' => 'Y-m-d',
        'pricing.enabled' => true,
        'pricing.currency' => 'rmb',
    ];

    public function __construct(
        private readonly PlatformConfigurationHandler $config
    ) {
    }

    public function postUpdate(): void
    {
        foreach (self::TARGET as $key => $value) {
            $this->config->setParameter($key, $value);
        }

        $this->logger?->info('Platform default parameters applied (15.0.103): '.implode(', ', array_keys(self::TARGET)));
    }
}
