<?php

namespace Claroline\OpenBadgeBundle\Component\BadgeRule;

use Claroline\AppBundle\Component\ComponentInterface;
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

interface RuleInterface extends ComponentInterface, EventSubscriberInterface
{
    /**
     * Gets the list of Users who meet the rules.
     * NB. You don't need to filter users who already own the badge, this is down in the generic layer.
     *
     * @return User[]
     */
    public function getQualifiedUsers(Rule $rule): iterable;

    public function getEvidenceMessage(): string;
}
