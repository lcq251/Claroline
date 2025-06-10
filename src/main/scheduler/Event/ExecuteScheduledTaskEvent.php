<?php

namespace Claroline\SchedulerBundle\Event;

use Claroline\SchedulerBundle\Entity\ScheduledTask;
use Symfony\Contracts\EventDispatcher\Event;

class ExecuteScheduledTaskEvent extends Event
{
    private ScheduledTask $task;

    private string $status = ScheduledTask::SUCCESS;

    public function __construct(ScheduledTask $task)
    {
        $this->task = $task;
    }

    public function getTask(): ScheduledTask
    {
        return $this->task;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }
}
