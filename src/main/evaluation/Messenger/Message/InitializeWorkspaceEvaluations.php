<?php

namespace Claroline\EvaluationBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncHighMessageInterface;

final class InitializeWorkspaceEvaluations implements AsyncHighMessageInterface
{
    public function __construct(
        private readonly int $workspaceId,
        private readonly array $userIds
    ) {
    }

    public function getWorkspaceId(): int
    {
        return $this->workspaceId;
    }

    public function getUserIds(): array
    {
        return $this->userIds;
    }
}
