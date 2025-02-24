<?php

namespace Claroline\EvaluationBundle\Messenger;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Entity\UserEvaluation\SequenceEvaluation;
use Claroline\EvaluationBundle\Manager\SequenceEvaluationManager;
use Claroline\EvaluationBundle\Messenger\Message\RecomputeSequenceEvaluations;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Recompute WorkspaceEvaluations for a Workspace and a list of Users.
 */
#[AsMessageHandler]
class RecomputeSequenceEvaluationsHandler
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly SequenceEvaluationManager $evaluationManager
    ) {
    }

    public function __invoke(RecomputeSequenceEvaluations $initMessage): void
    {
        $sequence = $this->om->getRepository(Sequence::class)->find($initMessage->getSequenceId());
        if (empty($sequence)) {
            return;
        }

        $evaluations = $this->om->getRepository(SequenceEvaluation::class)->findInProgress($sequence);

        $this->om->startFlushSuite();

        foreach ($evaluations as $i => $evaluation) {
            $this->evaluationManager->refreshEvaluation($evaluation);

            if (0 === $i % 200) {
                $this->om->forceFlush();
            }
        }

        $this->om->endFlushSuite();
    }
}
