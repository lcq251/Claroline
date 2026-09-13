<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Configuration;

use Claroline\CoreBundle\Library\Configuration\ParameterProviderInterface;

/**
 * Default platform parameters for the mindme-aibase bundle.
 *
 * These are injected into the platform configuration (via the
 * `claroline.configuration` service tag) and editable from the administration
 * parameters UI.
 */
class PlatformDefaults implements ParameterProviderInterface
{
    public function getDefaultParameters(): array
    {
        return [
            'mindme_aibase' => [
                // Show/hide the "human support" entry in the left app menu.
                'support_enabled' => true,
                // Uuid of the Aiteacher resource used as the global support avatar
                // (reuses the digital-teacher brain / TTS endpoints).
                'support_teacher_uuid' => '',
            ],
        ];
    }
}
