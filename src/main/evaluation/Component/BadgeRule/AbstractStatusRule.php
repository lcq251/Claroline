<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule;

use Claroline\EvaluationBundle\Entity\UserEvaluation\AbstractUserEvaluation;
use Claroline\EvaluationBundle\Library\EvaluationStatus;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;

abstract class AbstractStatusRule extends AbstractEvaluationRule
{
    protected function checkEvaluation(Rule $rule, AbstractUserEvaluation $evaluation): bool
    {
        $data = $rule->getData();
        if (empty($data) || empty($data['value'])) {
            return false;
        }

        return EvaluationStatus::PRIORITY[$data['value']] <= EvaluationStatus::PRIORITY[$evaluation->getStatus()];
    }
}
