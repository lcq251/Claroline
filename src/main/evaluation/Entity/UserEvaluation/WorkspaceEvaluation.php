<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\EvaluationBundle\Entity\UserEvaluation;

use Claroline\AppBundle\API\Attribute\CrudEntity;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\EvaluationBundle\Finder\WorkspaceEvaluationType;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_workspace_evaluation')]
#[ORM\UniqueConstraint(name: 'workspace_user_evaluation', columns: ['workspace_id', 'user_id'])]
#[ORM\Entity()]
#[CrudEntity(finderClass: WorkspaceEvaluationType::class)]
class WorkspaceEvaluation extends AbstractUserEvaluation
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

    public function isCertified(): bool
    {
        return true;
    }

    public function getScoreMax(): ?float
    {
        if ($this->scoreMax) {
            return $this->scoreMax;
        }

        return $this->workspace?->getScoreTotal();
    }

    public function getEstimatedDuration(): ?int
    {
        return $this->workspace?->getEstimatedDuration() ?? 0;
    }
}
