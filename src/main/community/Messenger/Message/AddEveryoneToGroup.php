<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CommunityBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncLowMessageInterface;

/**
 * Adds all the organization users to the group.
 */
class AddEveryoneToGroup implements AsyncLowMessageInterface
{
    public function __construct(
        private readonly int $groupId,
    ) {
    }

    public function getGroupId(): int
    {
        return $this->groupId;
    }
}
