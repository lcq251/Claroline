<?php

namespace Claroline\OpenBadgeBundle\Component\BadgeRule;

use Claroline\AppBundle\Component\ComponentInterface;
use Claroline\AppBundle\Component\Context\ContextualInterface;
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Entity\Rule;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

interface RuleInterface extends ComponentInterface, ContextualInterface, EventSubscriberInterface
{
    /**
     * Gets the list of Users who meet the rules.
     * NB. You don't need to filter users who already own the badge, this is down in the generic layer.
     *
     * @return User[]
     */
    public function getQualifiedUsers(Rule $rule, ?object $subject = null): iterable;

    public function getEvidenceMessage(): string;
}
