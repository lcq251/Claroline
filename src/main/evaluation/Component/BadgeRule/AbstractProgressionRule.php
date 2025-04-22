<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule;

use Claroline\EvaluationBundle\Entity\UserEvaluation\AbstractUserEvaluation;
use Claroline\OpenBadgeBundle\Entity\Rule;

abstract class AbstractProgressionRule extends AbstractEvaluationRule
{
    protected function checkEvaluation(Rule $rule, AbstractUserEvaluation $evaluation): bool
    {
        $data = $rule->getData();
        if (empty($data)) {
            return false;
        }

        $expectedProgression = $data['value'];
        if ($expectedProgression > 100) {
            // progression is a percentage, it can not be over 100
            $expectedProgression = 100;
        }

        return $evaluation->getProgression() >= $expectedProgression;
    }
}
