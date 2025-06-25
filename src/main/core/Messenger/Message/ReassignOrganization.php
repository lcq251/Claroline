<?php

namespace Claroline\CoreBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncLowMessageInterface;
use Claroline\CoreBundle\Entity\Organization\Organization;

class ReassignOrganization implements AsyncLowMessageInterface
{
    public function __construct(
        private readonly Organization $organization
    ) {
    }

    /**
     * Return the organization to use as a replacement.
     */
    public function getOrganization(): Organization
    {
        return $this->organization;
    }
}
