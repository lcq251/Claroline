<?php

namespace Claroline\EvaluationBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncHighMessageInterface;

/**
 * Sent when we want to recompute all the user evaluations linked to the workspace.
 */
final class RecomputeWorkspaceEvaluations implements AsyncHighMessageInterface
{
    public function __construct(
        private readonly int $workspaceId
    ) {
    }

    public function getWorkspaceId(): int
    {
        return $this->workspaceId;
    }
}
