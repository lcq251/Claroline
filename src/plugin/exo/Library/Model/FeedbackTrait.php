<?php

namespace UJM\ExoBundle\Library\Model;

use Doctrine\ORM\Mapping as ORM;

/**
 * Gives an entity the ability to have a feedback.
 */
trait FeedbackTrait
{
    /**
     * Feedback content.
     */
    #[ORM\Column(name: 'feedback', type: 'text', nullable: true)]
    private ?string $feedback = '';

    public function setFeedback(?string $feedback): void
    {
        $this->feedback = $feedback;
    }

    public function getFeedback(): string
    {
        if (!$this->feedback) {
            return '';
        }

        return $this->feedback;
    }
}
