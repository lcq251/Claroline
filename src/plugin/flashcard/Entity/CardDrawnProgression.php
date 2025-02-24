<?php

namespace Claroline\FlashcardBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceAttempt;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * CardDrawnProgression
 * Represents the progression of a Card drawn.
 */
#[ORM\Table(name: 'claro_flashcard_drawn_progression')]
#[ORM\Entity]
class CardDrawnProgression
{
    use Id;

    #[ORM\JoinColumn(name: 'flashcard_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Flashcard::class)]
    private Flashcard $flashcard;

    #[ORM\JoinColumn(name: 'resource_evaluation_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: ResourceAttempt::class)]
    private ResourceAttempt $resourceEvaluation;

    #[ORM\Column(name: 'success_count', type: Types::INTEGER)]
    private int $successCount;

    public function __construct()
    {
        $this->successCount = -1;
    }

    public function getFlashcard(): Flashcard
    {
        return $this->flashcard;
    }

    public function setFlashcard(Flashcard $card): static
    {
        $this->flashcard = $card;

        return $this;
    }

    public function getResourceEvaluation(): ResourceAttempt
    {
        return $this->resourceEvaluation;
    }

    public function setResourceEvaluation(ResourceAttempt $resourceEvaluation): static
    {
        $this->resourceEvaluation = $resourceEvaluation;

        return $this;
    }

    public function isSuccessful(): bool
    {
        return $this->successCount > 0;
    }

    public function isAnswered(): bool
    {
        return $this->successCount > -1;
    }

    public function getSuccessCount(): int
    {
        return $this->successCount;
    }

    public function setSuccessCount(int $successCount): static
    {
        $this->successCount = $successCount;

        return $this;
    }
}
