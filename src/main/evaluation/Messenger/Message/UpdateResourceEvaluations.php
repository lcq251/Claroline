<?php

namespace Claroline\EvaluationBundle\Messenger\Message;

use Claroline\AppBundle\Messenger\Message\AsyncHighMessageInterface;
use Claroline\EvaluationBundle\Library\EvaluationStatus;

final readonly class UpdateResourceEvaluations implements AsyncHighMessageInterface
{
    public function __construct(
        private int $resourceNodeId,
        private array $userIds,
        private ?string $status = EvaluationStatus::NOT_ATTEMPTED,
        private ?bool $withCreation = true
    ) {
    }

    public function getResourceNodeId(): int
    {
        return $this->resourceNodeId;
    }

    public function getUserIds(): array
    {
        return $this->userIds;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getWithCreation(): bool
    {
        return $this->withCreation;
    }
}
