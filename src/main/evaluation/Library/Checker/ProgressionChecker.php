<?php

namespace Claroline\EvaluationBundle\Library\Checker;

use Claroline\EvaluationBundle\Library\EvaluationInterface;
use Claroline\EvaluationBundle\Library\EvaluationStatus;

class ProgressionChecker implements CheckerInterface
{
    private ?float $threshold;

    public function __construct(?float $threshold = 100)
    {
        if ($threshold < 0 || $threshold > 100) {
            throw new \InvalidArgumentException('threshold should be a percentage (range: 0-100).');
        }

        $this->threshold = $threshold;
    }

    public function supports(EvaluationInterface $evaluation): bool
    {
        return true;
    }

    public function vote(EvaluationInterface $evaluation): ?string
    {
        if (0 >= $evaluation->getProgression()) {
            return EvaluationStatus::NOT_ATTEMPTED;
        }

        if ($this->threshold > $evaluation->getProgression()) {
            return EvaluationStatus::INCOMPLETE;
        }

        return EvaluationStatus::COMPLETED;
    }
}
