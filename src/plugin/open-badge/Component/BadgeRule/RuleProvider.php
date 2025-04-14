<?php

namespace Claroline\OpenBadgeBundle\Component\BadgeRule;

use Claroline\AppBundle\Component\AbstractComponentProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Entity\Evidence;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;

/**
 * Aggregates all the badge rules defined in the Claroline app.
 *
 * A tool MUST :
 *   - be declared as a symfony service and tagged with "claroline.component.badge_rule".
 *   - implement the ToolInterface interface (or the AbstractTool class in most cases).
 */
class RuleProvider extends AbstractComponentProvider
{
    public function __construct(
        private readonly iterable $registeredRules,
        private readonly ObjectManager $om
    ) {
    }

    final public static function getServiceTag(): string
    {
        return 'claroline.component.badge_rule';
    }

    /**
     * Get the list of all the rules injected in the app by the current plugins.
     * It does not contain rules for disabled plugins.
     */
    protected function getRegisteredComponents(): iterable
    {
        return $this->registeredRules;
    }

    /**
     * Get the list of all implemented rules.
     * It contains the rules from all the enabled plugins.
     */
    public function getAvailableRules(): array
    {
        $available = [];
        foreach ($this->getRegisteredComponents() as $ruleComponent) {
            $available[] = [
                'name' => $ruleComponent->getName(),
            ];
        }

        return $available;
    }

    public function grantRule(Rule $rule): array
    {
        /** @var RuleInterface $ruleDefinition */
        $ruleDefinition = $this->getComponent($rule->getAction());

        // find all users which met the current rule
        $users = $ruleDefinition->getQualifiedUsers($rule);

        // find users which already have evidence for the rule
        $evidences = $this->om->getRepository(Evidence::class)->findBy(['rule' => $rule]);
        $owners = array_map(function (Evidence $evidence) {
            return $evidence->getUser()->getUuid();
        }, $evidences);

        $recomputeUsers = [];
        foreach ($users as $user) {
            if (!$user->isDisabled() && !$user->isRemoved() && !in_array($user->getUuid(), $owners)) {
                $this->createEvidence($rule, $user);

                $recomputeUsers[$user->getUuid()] = $user; // using uuid as key will automatically deduplicate the array
            }
        }

        return $recomputeUsers;
    }

    public function createEvidence(Rule $rule, User $user): Evidence
    {
        /** @var RuleInterface $ruleDefinition */
        $ruleDefinition = $this->getComponent($rule->getAction());

        $evidence = new Evidence();

        $evidence->setName($rule->getAction());
        $evidence->setRule($rule);
        $evidence->setUser($user);

        $evidence->setDescription($ruleDefinition->getEvidenceMessage());

        $this->om->persist($evidence);
        $this->om->flush();

        return $evidence;
    }
}
