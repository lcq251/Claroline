<?php

namespace Claroline\EvaluationBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncHighMessageInterface;

/**
 * Sent when we want to remove all the user evaluations linked to the resource.
 */
final readonly class PurgeResourceEvaluations implements AsyncHighMessageInterface
{
    public function __construct(
        private int $resourceId
    ) {
    }

    public function getResourceId(): int
    {
        return $this->resourceId;
    }
}
