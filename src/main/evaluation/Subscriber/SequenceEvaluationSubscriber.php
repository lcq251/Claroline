<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\EvaluationBundle\Subscriber;

use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\Crud\UpdateEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\EvaluationBundle\Event\EvaluationEvents;
use Claroline\EvaluationBundle\Event\ResourceEvaluationEvent;
use Claroline\EvaluationBundle\Manager\SequenceEvaluationManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Updates the sequence evaluation in response to user actions.
 */
class SequenceEvaluationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly SequenceEvaluationManager $manager
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            EvaluationEvents::RESOURCE_EVALUATION => 'onResourceEvaluate',
            CrudEvents::getEventName(CrudEvents::POST_UPDATE, ResourceNode::class) => 'onResourcePublicationChange',
            CrudEvents::getEventName(CrudEvents::POST_DELETE, ResourceNode::class) => 'onResourceDelete',
        ];
    }

    /**
     * Recomputes the sequence evaluations each time a user is evaluated for a resource.
     */
    public function onResourceEvaluate(ResourceEvaluationEvent $event): void
    {
        $user = $event->getUser();
        $resourceNode = $event->getResourceNode();

        // find sequences which use the resource and recompute the user evaluations for them
        $sequences = $this->manager->getByResource($resourceNode);
        foreach ($sequences as $sequence) {
            $this->manager->computeEvaluation($sequence, $user);
        }
    }

    /**
     * Recomputes WorkspaceEvaluations when a resource is deleted.
     */
    public function onResourceDelete(DeleteEvent $event): void
    {
        /** @var ResourceNode $resourceNode */
        $resourceNode = $event->getObject();

        if ($resourceNode->isRequired() && $resourceNode->isPublished()) {
            // find sequences which use the resource and recompute the user evaluations for them
            $sequences = $this->manager->getByResource($resourceNode);
            foreach ($sequences as $sequence) {
                $this->manager->recomputeEvaluations($sequence);
            }
        }
    }

    public function onResourcePublicationChange(UpdateEvent $event): void
    {
        /** @var ResourceNode $resourceNode */
        $resourceNode = $event->getObject();
        $oldData = $event->getOldData();

        if ($resourceNode->isRequired() && !empty($oldData['meta']) && ($oldData['meta']['published'] !== $resourceNode->isPublished())) {
            // find sequences which use the resource and recompute the user evaluations for them
            $sequences = $this->manager->getByResource($resourceNode);
            foreach ($sequences as $sequence) {
                $this->manager->recomputeEvaluations($sequence);
            }
        }
    }
}
