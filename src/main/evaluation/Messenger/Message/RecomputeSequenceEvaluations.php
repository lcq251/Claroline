<?php

namespace Claroline\EvaluationBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncHighMessageInterface;

/**
 * Sent when we want to recompute all the user evaluations linked to the sequence.
 */
final readonly class RecomputeSequenceEvaluations implements AsyncHighMessageInterface
{
    public function __construct(
        private int $sequenceId
    ) {
    }

    public function getSequenceId(): int
    {
        return $this->sequenceId;
    }
}
