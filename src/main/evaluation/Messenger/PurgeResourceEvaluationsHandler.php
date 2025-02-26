<?php

namespace Claroline\EvaluationBundle\Messenger;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\EvaluationBundle\Messenger\Message\PurgeResourceEvaluations;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Removes all evaluations for a resource.
 */
#[AsMessageHandler]
readonly class PurgeResourceEvaluationsHandler
{
    public function __construct(
        private ObjectManager $om,
        private Crud $crud
    ) {
    }

    public function __invoke(PurgeResourceEvaluations $initMessage): void
    {
        $resource = $this->om->getRepository(ResourceNode::class)->find($initMessage->getResourceId());
        if (empty($resource)) {
            return;
        }

        $evaluations = $this->om->getRepository(ResourceEvaluation::class)->findBy(['resourceNode' => $resource]);

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
