<?php

namespace UJM\ExoBundle\Library\Attempt;

/**
 * Generic class used to apply score to a user answer.
 */
class GenericScore implements AnswerPartInterface
{
    private float $score;

    public function __construct(float|string $score)
    {
        if (!is_numeric($score)) {
            throw new \InvalidArgumentException('score should be a number.');
        }

        $this->score = floatval($score);
    }

    /**
     * Get the score to apply.
     */
    public function getScore(): float
    {
        return $this->score;
    }
}
