<?php

namespace Claroline\EvaluationBundle\Entity\Parameters;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_evaluation_workspace_parameters')]
class WorkspaceParameters extends AbstractEvaluationParameters
{
    #[ORM\JoinColumn(name: 'workspace_id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Workspace::class)]
    private ?Workspace $workspace = null;

    public function getWorkspace(): ?Workspace
    {
        return $this->workspace;
    }

    public function setWorkspace(Workspace $workspace): void
    {
        $this->workspace = $workspace;
    }
}
