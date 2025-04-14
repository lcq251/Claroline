<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule;

use Claroline\EvaluationBundle\Entity\UserEvaluation\AbstractUserEvaluation;
use Claroline\OpenBadgeBundle\Component\BadgeRule\RuleComponent;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;

abstract class AbstractEvaluationRule extends RuleComponent
{
    /**
     * Checks if user evaluation meets rule criteria.
     */
    abstract protected function checkEvaluation(Rule $rule, AbstractUserEvaluation $evaluation): bool;

    /**
     * @param AbstractUserEvaluation[] $evaluations
     */
    protected function checkEvaluations(Rule $rule, array $evaluations): array
    {
        return array_map(function (AbstractUserEvaluation $evaluation) {
            return $evaluation->getUser();
        }, array_filter($evaluations, function (AbstractUserEvaluation $evaluation) use ($rule) {
            return $this->checkEvaluation($rule, $evaluation);
        }));
    }

    /**
     * Grants the rule if the user evaluation meets rule criteria.
     */
    protected function grantEvaluation(Rule $rule, AbstractUserEvaluation $evaluation): void
    {
        if ($this->checkEvaluation($rule, $evaluation)) {
            $this->grant($rule, $evaluation->getUser());
        }
    }
}
