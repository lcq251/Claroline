<?php

namespace Claroline\OpenBadgeBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Entity\Evidence;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use Claroline\OpenBadgeBundle\Library\Rules\AbstractRule;
use Claroline\OpenBadgeBundle\Messenger\Message\GrantRule;
use Symfony\Component\Messenger\MessageBusInterface;

class RuleManager
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly MessageBusInterface $messageBus,
        private readonly iterable $rules
    ) {
    }

    public function getRule(string $type): ?AbstractRule
    {
        $rules = $this->rules instanceof \Traversable ? iterator_to_array($this->rules) : $this->rules;
        if (!isset($rules[$type])) {
            throw new \RuntimeException(sprintf('No rule found for type "%s" Maybe you forgot to add the "claroline.badge.rule" tag to your finder.', $type));
        }

        return $rules[$type];
    }

    public function grant(Rule $rule, User $user): void
    {
        $this->messageBus->dispatch(new GrantRule($rule->getId(), $user->getId()));
    }
}
