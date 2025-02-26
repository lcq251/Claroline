<?php

namespace Claroline\EvaluationBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncHighMessageInterface;

/**
 * Sent when we want to remove all the user evaluations linked to the sequence.
 */
final readonly class PurgeSequenceEvaluations implements AsyncHighMessageInterface
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
