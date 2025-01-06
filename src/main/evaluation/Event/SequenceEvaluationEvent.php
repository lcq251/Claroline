<?php

namespace Claroline\EvaluationBundle\Event;

use Claroline\CoreBundle\Entity\User;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Entity\SequenceEvaluation;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Event dispatched when a sequence evaluation is created or updated.
 */
class SequenceEvaluationEvent extends Event
{
    public function __construct(
        private readonly SequenceEvaluation $evaluation,
        private readonly array $changes
    ) {
    }

    /**
     * Get the current evaluation.
     */
    public function getEvaluation(): SequenceEvaluation
    {
        return $this->evaluation;
    }

    public function getSequence(): Sequence
    {
        return $this->evaluation->getSequence();
    }

    public function getUser(): User
    {
        return $this->evaluation->getUser();
    }

    public function hasStatusChanged(): bool
    {
        return $this->changes['status'];
    }

    public function hasProgressionChanged(): bool
    {
        return $this->changes['progression'];
    }

    public function hasScoreChanged(): bool
    {
        return $this->changes['score'];
    }
}
