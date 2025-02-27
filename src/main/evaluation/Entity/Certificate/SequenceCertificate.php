<?php

namespace Claroline\EvaluationBundle\Entity\Certificate;

use Claroline\EvaluationBundle\Entity\UserEvaluation\SequenceEvaluation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_evaluation_sequence_certificate')]
#[ORM\Entity]
class SequenceCertificate extends AbstractCertificate
{
    #[ORM\JoinColumn(name: 'evaluation_id', nullable: true, onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: SequenceEvaluation::class)]
    private ?SequenceEvaluation $evaluation;

    public function getEvaluation(): ?SequenceEvaluation
    {
        return $this->evaluation;
    }

    public function setEvaluation(?SequenceEvaluation $evaluation): void
    {
        $this->evaluation = $evaluation;
    }
}
