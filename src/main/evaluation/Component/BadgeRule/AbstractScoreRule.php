<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule;

use Claroline\EvaluationBundle\Entity\UserEvaluation\AbstractUserEvaluation;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;

abstract class AbstractScoreRule extends AbstractEvaluationRule
{
    protected function checkEvaluation(Rule $rule, AbstractUserEvaluation $evaluation): bool
    {
        $data = $rule->getData();
        if (empty($data)) {
            return false;
        }

        $scoreProgress = 0;
        if ($evaluation->getScoreMax()) {
            $scoreProgress = ($evaluation->getScore() ?? 0) / $evaluation->getScoreMax() * 100;
        }

        return $scoreProgress >= $data['value'];
    }
}
