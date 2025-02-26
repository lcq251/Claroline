<?php

namespace Claroline\EvaluationBundle\Messenger;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\EvaluationBundle\Entity\UserEvaluation\WorkspaceEvaluation;
use Claroline\EvaluationBundle\Messenger\Message\PurgeWorkspaceEvaluations;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Removes all evaluations for a workspace.
 */
#[AsMessageHandler]
readonly class PurgeWorkspaceEvaluationsHandler
{
    public function __construct(
        private ObjectManager $om,
        private Crud $crud
    ) {
    }

    public function __invoke(PurgeWorkspaceEvaluations $initMessage): void
    {
        $workspace = $this->om->getRepository(Workspace::class)->find($initMessage->getWorkspaceId());
        if (empty($workspace)) {
            return;
        }

        $evaluations = $this->om->getRepository(WorkspaceEvaluation::class)->findBy(['workspace' => $workspace]);

        $this->om->startFlushSuite();

        foreach ($evaluations as $i => $evaluation) {
            $this->crud->delete($evaluation, [Crud::NO_PERMISSIONS, Crud::NO_VALIDATION]);

            if (0 === $i % 200) {
                $this->om->forceFlush();
            }
        }

        $this->om->endFlushSuite();
    }
}
