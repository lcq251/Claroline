<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule;

use Claroline\EvaluationBundle\Entity\UserEvaluation\AbstractUserEvaluation;
use Claroline\OpenBadgeBundle\Entity\Rule;

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

        $comparator = $data['comparator'] ?? 'gte';

        return match ($comparator) {
            'equal' => $scoreProgress === $data['value'],
            'between' => $scoreProgress >= $data['value'] && $scoreProgress <= $data['value'],
            'lte' => $scoreProgress <= $data['value'],
            default => $scoreProgress >= $data['value'],
        };
    }
}
