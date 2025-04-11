<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\InstallationBundle\Migrations;

class InvalidVersionException extends \Exception
{
    private string $usageMessage;

    public function __construct(string $version)
    {
        $message = 'Version must be either a numeric string or a Migrator::VERSION_* class constant';
        $this->usageMessage = sprintf(
            'Invalid target version "%s": version must be either "%s", "%s" or an explicit version number',
            $version,
            Migrator::VERSION_NEAREST,
            Migrator::VERSION_LATEST
        );
        parent::__construct($message);
    }

    public function getUsageMessage(): string
    {
        return $this->usageMessage;
    }
}
