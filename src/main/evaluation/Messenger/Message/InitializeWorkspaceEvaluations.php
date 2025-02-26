<?php

namespace Claroline\EvaluationBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncHighMessageInterface;

final readonly class InitializeWorkspaceEvaluations implements AsyncHighMessageInterface
{
    public function __construct(
        private int $workspaceId,
        private array $userIds
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
