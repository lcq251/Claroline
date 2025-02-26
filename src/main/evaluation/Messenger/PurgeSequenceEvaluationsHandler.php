<?php

namespace Claroline\EvaluationBundle\Messenger;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Entity\UserEvaluation\SequenceEvaluation;
use Claroline\EvaluationBundle\Messenger\Message\PurgeSequenceEvaluations;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Removes all evaluations for a sequence.
 */
#[AsMessageHandler]
readonly class PurgeSequenceEvaluationsHandler
{
    public function __construct(
        private ObjectManager $om,
        private Crud $crud
    ) {
    }

    public function __invoke(PurgeSequenceEvaluations $initMessage): void
    {
        $sequence = $this->om->getRepository(Sequence::class)->find($initMessage->getSequenceId());
        if (empty($sequence)) {
            return;
        }

        $evaluations = $this->om->getRepository(SequenceEvaluation::class)->findBy(['sequence' => $sequence]);

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
