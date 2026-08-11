<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Configuration;

use Claroline\CoreBundle\Library\Configuration\ParameterProviderInterface;

/**
 * mindme-ai 平台默认参数（仅默认值语义：键不存在时才生效，管理员可改且不被容器编译重置）。
 *
 *   mindme.wechat.enabled = false  (微信登录总闸，默认关；开通需在 platform_options.json 手动改 true)
 */
class PlatformDefaults implements ParameterProviderInterface
{
    public function getDefaultParameters(): array
    {
        return [
            'mindme' => [
                'wechat' => [
                    'enabled' => false,
                ],
            ],
        ];
    }
}
