<?php

namespace UJM\ExoBundle\Library\Model;

use Doctrine\ORM\Mapping as ORM;

/**
 * Gives an entity the ability to have a penalty.
 */
trait PenaltyTrait
{
    #[ORM\Column(name: 'penalty', type: 'float')]
    private ?float $penalty = 0;

    public function setPenalty(?float $penalty): void
    {
        $this->penalty = $penalty;
    }

    public function getPenalty(): ?float
    {
        return $this->penalty;
    }
}
