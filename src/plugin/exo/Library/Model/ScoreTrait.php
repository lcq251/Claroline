<?php

namespace UJM\ExoBundle\Library\Model;

use Doctrine\ORM\Mapping as ORM;

/**
 * Gives an entity the ability to have a score.
 */
trait ScoreTrait
{
    #[ORM\Column(name: 'score', type: 'float', nullable: true)]
    private ?float $score = 0;

    public function setScore(?float $score): void
    {
        $this->score = $score;
    }

    public function getScore(): ?float
    {
        return $this->score;
    }
}
