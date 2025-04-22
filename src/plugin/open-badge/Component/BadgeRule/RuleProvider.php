<?php

namespace Claroline\OpenBadgeBundle\Component\BadgeRule;

use Claroline\AppBundle\Component\AbstractComponentProvider;
use Claroline\AppBundle\Component\Context\ContextProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Entity\Evidence;
use Claroline\OpenBadgeBundle\Entity\Rule;

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
        private readonly ContextProvider $contextProvider,
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
     *
     * @return RuleComponent[]
     */
    public function getAvailableRules(string $context, ?string $contextId = null): array
    {
        $contextHandler = $this->contextProvider->getContext($context);
        $contextSubject = $contextHandler->getObject($contextId);

        $available = [];
        foreach ($this->getRegisteredComponents() as $ruleComponent) {
            if ($ruleComponent->supportsContext($context) && (empty($contextSubject) || $ruleComponent->supportsSubject($contextSubject))) {
                $available[] = $ruleComponent;
            }
        }

        return $available;
    }

    /**
     * Create missing evidences for all the users who match the rule criteria.
     *
     * @return array - The list of all users who match the rule criteria
     */
    public function grantRule(Rule $rule): array
    {
        /** @var RuleInterface $ruleDefinition */
        $ruleDefinition = $this->getComponent($rule->getAction());

        $subject = null;
        if ($rule->getSubjectClass() && $rule->getSubjectId()) {
            $subject = $this->om->getRepository($rule->getSubjectClass())->findOneBy([
                'uuid' => $rule->getSubjectId(),
            ]);
        }

        // find all users who match the current rule
        $users = $ruleDefinition->getQualifiedUsers($rule, $subject);

        // find users which already have evidence for the rule to exclude them
        $evidences = $this->om->getRepository(Evidence::class)->findBy(['rule' => $rule]);
        $owners = array_map(function (Evidence $evidence) {
            return $evidence->getUser()->getUuid();
        }, $evidences);

        $recomputeUsers = [];
        foreach ($users as $user) {
            if (!$user->isDisabled() && !$user->isRemoved()) {
                if (!in_array($user->getUuid(), $owners)) {
                    $this->createEvidence($rule, $user);
                }

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
