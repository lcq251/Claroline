<?php

namespace Claroline\EvaluationBundle\Subscriber;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\Crud\UpdateEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AuthenticationBundle\Messenger\Stamp\AuthenticationStamp;
use Claroline\CommunityBundle\Repository\UserRepository;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceAttempt;
use Claroline\EvaluationBundle\Library\EvaluationStatus;
use Claroline\EvaluationBundle\Manager\ResourceEvaluationManager;
use Claroline\EvaluationBundle\Messenger\Message\UpdateResourceEvaluations;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceEvaluationSubscriber implements EventSubscriberInterface
{
    private MessageBusInterface $messageBus;
    private ResourceEvaluationManager $manager;
    private UserRepository $userRepo;

    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        MessageBusInterface $messageBus,
        ObjectManager $om,
        ResourceEvaluationManager $manager
    ) {
        $this->messageBus = $messageBus;
        $this->manager = $manager;

        $this->userRepo = $om->getRepository(User::class);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::POST_CREATE, ResourceNode::class) => 'createEvaluations',
            CrudEvents::getEventName(CrudEvents::POST_UPDATE, ResourceNode::class) => 'updateEvaluations',
            CrudEvents::getEventName(CrudEvents::PRE_DELETE, ResourceAttempt::class) => 'updateNbAttempts',
        ];
    }

    public function createEvaluations(CreateEvent $event): void
    {
        /** @var ResourceNode $resourceNode */
        $resourceNode = $event->getObject();

        if (!$this->manager->supportsEvaluation($resourceNode)) {
            // nothing to do
            return;
        }

        /*if ($resourceNode->isRequired()) {
            $registeredUsers = $this->userRepo->findByWorkspaces([$resourceNode->getWorkspace()]);
            if (!empty($registeredUsers)) {
                $registeredUserIds = array_map(function (User $user) {
                    return $user->getId();
                }, $registeredUsers);

                $this->messageBus->dispatch(
                    new UpdateResourceEvaluations($resourceNode->getId(), $registeredUserIds),
                    [new AuthenticationStamp($this->tokenStorage->getToken()?->getUser()->getId())]
                );
            }
        }*/
    }

    public function updateEvaluations(UpdateEvent $event): void
    {
        /** @var ResourceNode $resourceNode */
        $resourceNode = $event->getObject();
        $oldData = $event->getOldData();

        if (!$this->manager->supportsEvaluation($resourceNode)) {
            // nothing to do
            return;
        }

        /*if (empty($oldData['evaluation']) || $resourceNode->isRequired() !== $oldData['evaluation']['required']) {
            $registeredUsers = $this->userRepo->findByWorkspaces([$resourceNode->getWorkspace()]);
            if (!empty($registeredUsers)) {
                $registeredUserIds = array_map(function (User $user) {
                    return $user->getId();
                }, $registeredUsers);

                $this->messageBus->dispatch(
                    new UpdateResourceEvaluations($resourceNode->getId(), $registeredUserIds, EvaluationStatus::NOT_ATTEMPTED, false),
                    [new AuthenticationStamp($this->tokenStorage->getToken()?->getUser()->getId())]
                );
            }
        }*/
    }

    public function updateNbAttempts(DeleteEvent $event): void
    {
        /** @var ResourceAttempt $resourceAttempt */
        $resourceAttempt = $event->getObject();

        $evaluation = $resourceAttempt->getResourceUserEvaluation();
        if ($evaluation) {
            $evaluation->setNbAttempts($evaluation->getNbAttempts() - 1);
        }
    }
}
