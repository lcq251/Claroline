<?php

namespace Claroline\EvaluationBundle\Entity\Certificate;

use Claroline\EvaluationBundle\Entity\UserEvaluation\WorkspaceEvaluation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_evaluation_certificate')]
#[ORM\Entity]
class WorkspaceCertificate extends AbstractCertificate
{
    #[ORM\JoinColumn(name: 'evaluation_id', nullable: true, onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: WorkspaceEvaluation::class)]
    private ?WorkspaceEvaluation $evaluation;

    public function getEvaluation(): ?WorkspaceEvaluation
    {
        return $this->evaluation;
    }

    public function setEvaluation(?WorkspaceEvaluation $evaluation): void
    {
        $this->evaluation = $evaluation;
    }
}
