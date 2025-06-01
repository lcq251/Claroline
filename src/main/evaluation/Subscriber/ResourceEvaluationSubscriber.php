<?php

namespace Claroline\EvaluationBundle\Subscriber;

use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceAttempt;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ResourceEvaluationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::PRE_DELETE, ResourceAttempt::class) => 'updateNbAttempts',
        ];
    }

    public function updateNbAttempts(DeleteEvent $event): void
    {
        /** @var ResourceAttempt $resourceAttempt */
        $resourceAttempt = $event->getObject();

        $evaluation = $resourceAttempt->getResourceUserEvaluation();
        if ($evaluation) {
            $evaluation->setNbAttempts($evaluation->getNbAttempts() - 1);
            $this->om->persist($evaluation);
        }
    }
}
