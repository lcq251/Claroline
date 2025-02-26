<?php

namespace Claroline\EvaluationBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncHighMessageInterface;

/**
 * Sent when we want to remove all the user evaluations linked to the workspace.
 */
final readonly class PurgeWorkspaceEvaluations implements AsyncHighMessageInterface
{
    public function __construct(
        private int $workspaceId
    ) {
    }

    public function getWorkspaceId(): int
    {
        return $this->workspaceId;
    }
}
