<?php

namespace UJM\ExoBundle\Library\Model;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Library\Options\Picking;
use UJM\ExoBundle\Library\Options\Recurrence;

/**
 * Gives an entity the ability to configure the generation of an attempt to an exercise (see Exercise and Step entities).
 */
trait AttemptParametersTrait
{
    /**
     * The picking method used to generate new attempts to the quiz.
     */
    #[ORM\Column(type: 'string')]
    private ?string $picking = Picking::STANDARD;

    #[ORM\Column(name: 'random_order', type: 'string')]
    private ?string $randomOrder = Recurrence::NEVER;

    #[ORM\Column(name: 'random_pick', type: 'string')]
    private ?string $randomPick = Recurrence::NEVER;

    #[ORM\Column(type: 'text')]
    private int|string|array $pick = 0;

    /**
     * Maximum time (in minutes) allowed.
     * If 0, there is no duration limit.
     */
    #[ORM\Column(type: 'integer')]
    private ?int $duration = 0;

    /**
     * Number of attempts allowed.
     * If 0, the user can retry as many times he wishes.
     */
    #[ORM\Column(name: 'max_attempts', type: 'integer')]
    private ?int $maxAttempts = 0;

    public function setRandomOrder(string $randomOrder): void
    {
        $this->randomOrder = $randomOrder;
    }

    public function getRandomOrder(): ?string
    {
        return $this->randomOrder;
    }

    public function setRandomPick(string $randomPick): void
    {
        $this->randomPick = $randomPick;
    }

    public function getRandomPick(): ?string
    {
        return $this->randomPick;
    }

    public function setPick(int|array $pick): void
    {
        $this->pick = json_encode($pick);
    }

    public function getPick(): int|array
    {
        return json_decode($this->pick, true);
    }

    public function setDuration(?int $duration): void
    {
        $this->duration = $duration;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setMaxAttempts(?int $maxAttempts): void
    {
        $this->maxAttempts = $maxAttempts;
    }

    public function getMaxAttempts(): ?int
    {
        return $this->maxAttempts;
    }
}
