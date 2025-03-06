<?php

namespace Claroline\EvaluationBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\CoreBundle\Entity\User;
use Claroline\EvaluationBundle\Entity\Sequence\Step;
use Claroline\EvaluationBundle\Library\EvaluationStatus;
use Claroline\EvaluationBundle\Repository\UserEvaluation\SequenceProgressionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * SequenceProgression
 * Represents the progression of a User in a Step.
 */
#[ORM\Table(name: 'innova_path_progression')]
#[ORM\Entity(repositoryClass: SequenceProgressionRepository::class)]
class SequenceProgression
{
    use Id;

    /**
     * Step for which we track the progression.
     */
    #[ORM\ManyToOne(targetEntity: Step::class)]
    #[ORM\JoinColumn(name: 'step_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private Step $step;

    /**
     * User for which we track the progression.
     */
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private ?User $user = null;

    /**
     * Current state of the Step.
     */
    #[ORM\Column(name: 'progression_status', type: Types::STRING)]
    private string $status = EvaluationStatus::NOT_ATTEMPTED;

    public function getStep(): ?Step
    {
        return $this->step;
    }

    public function setStep(Step $step): void
    {
        $this->step = $step;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }
}
