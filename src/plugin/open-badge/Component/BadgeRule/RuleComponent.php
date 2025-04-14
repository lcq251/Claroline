<?php

namespace Claroline\OpenBadgeBundle\Component\BadgeRule;

use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use Claroline\OpenBadgeBundle\Messenger\Message\GrantRule;
use Symfony\Component\Messenger\MessageBusInterface;

abstract class RuleComponent implements RuleInterface
{
    private MessageBusInterface $messageBus;

    /**
     * @internal only used by DI
     */
    public function setMessageBus(MessageBusInterface $messageBus): void
    {
        $this->messageBus = $messageBus;
    }

    public function grant(Rule $rule, User $user): void
    {
        $this->messageBus->dispatch(new GrantRule($rule->getId(), $user->getId()));
    }
}
