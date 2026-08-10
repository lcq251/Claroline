<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Tests\Installation\Updater;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\MindMeAiBundle\Installation\Updater\Updater150103;
use PHPUnit\Framework\TestCase;

class Updater150103Test extends TestCase
{
    /**
     * The 6 platform parameters the installer must force on every run
     * (A1 强制策略, user decision 2026-08-10).
     */
    private const TARGETS = [
        'home.type' => 'tool',
        'intl.locale' => 'zh',
        'intl.timezone' => 'Asia/Shanghai',
        'intl.dateFormat' => 'Y-m-d',
        'pricing.enabled' => true,
        'pricing.currency' => 'rmb',
    ];

    public function testSetDefaultPlatformParameters(): void
    {
        $calls = [];

        $handler = $this->createMock(PlatformConfigurationHandler::class);
        $handler
            ->expects($this->exactly(count(self::TARGETS)))
            ->method('setParameter')
            ->willReturnCallback(function (string $key, $value) use (&$calls) {
                $calls[$key] = $value;
            });

        (new Updater150103($handler))->postUpdate();

        foreach (self::TARGETS as $key => $expected) {
            $this->assertArrayHasKey($key, $calls, sprintf('The updater must call setParameter for "%s".', $key));
            $this->assertSame($expected, $calls[$key], sprintf('The value written for "%s" must be the forced default.', $key));
        }
    }

    public function testPostUpdateIsIdempotent(): void
    {
        // A1 强制语义: the updater writes the target values again on every run
        // (no early-exit marker), so a second run behaves exactly like the first.
        $calls = [];

        $handler = $this->createMock(PlatformConfigurationHandler::class);
        $handler
            ->expects($this->exactly(2 * count(self::TARGETS)))
            ->method('setParameter')
            ->willReturnCallback(function (string $key, $value) use (&$calls) {
                $calls[$key] = $value;
            });

        $updater = new Updater150103($handler);

        $updater->postUpdate();
        $updater->postUpdate();

        $this->assertCount(count(self::TARGETS), array_unique($calls), 'A second run must re-write every target key.');
    }
}
