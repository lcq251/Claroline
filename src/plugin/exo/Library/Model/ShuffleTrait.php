<?php

namespace UJM\ExoBundle\Library\Model;

use Doctrine\ORM\Mapping as ORM;

/**
 * Gives an entity the ability to have a togglable shuffle mode.
 */
trait ShuffleTrait
{
    /**
     * Is shuffle enabled ?
     */
    #[ORM\Column(name: 'shuffle', type: 'boolean')]
    private bool $shuffle = false;

    public function setShuffle(bool $shuffle): void
    {
        $this->shuffle = $shuffle;
    }

    public function getShuffle(): bool
    {
        return $this->shuffle;
    }
}
