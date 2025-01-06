<?php

namespace Claroline\EvaluationBundle\Entity;

use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Repository\SequenceEvaluationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_evaluation_sequence_evaluation')]
#[ORM\Entity(repositoryClass: SequenceEvaluationRepository::class)]
class SequenceEvaluation extends AbstractUserEvaluation
{
    #[ORM\ManyToOne(targetEntity: Sequence::class)]
    #[ORM\JoinColumn(name: 'sequence_id', onDelete: 'CASCADE')]
    private ?Sequence $sequence = null;

    public function getSequence(): ?Sequence
    {
        return $this->sequence;
    }

    public function setSequence(Sequence $sequence): void
    {
        $this->sequence = $sequence;
    }

    public function isRequired(): bool
    {
        if ($this->sequence) {
            return $this->sequence->isRequired();
        }

        return false;
    }

    public function getEstimatedDuration(): ?int
    {
        if ($this->sequence) {
            return $this->sequence->getEstimatedDuration();
        }

        return 0;
    }
}
