<?php

namespace Claroline\CursusBundle\Listener\DataSource;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\DataSource;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\DataSource\GetDataEvent;
use Claroline\CursusBundle\Entity\Event;
use Claroline\CursusBundle\Entity\Session;
use Claroline\CursusBundle\Repository\SessionRepository;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class EventsSource
{
    private SessionRepository $sessionRepo;

    public function __construct(
        private readonly AuthorizationCheckerInterface $authorization,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly FinderProvider $finder,
        ObjectManager $om
    ) {
        $this->sessionRepo = $om->getRepository(Session::class);
    }

    public function getData(GetDataEvent $event): void
    {
        $options = $event->getOptions();

        $options['hiddenFilters']['terminated'] = false;

        if (DataSource::CONTEXT_WORKSPACE === $event->getContext()) {
            $options['hiddenFilters']['session'] = array_map(function (Session $session) {
                return $session->getUuid();
            }, $this->sessionRepo->findByWorkspace($event->getWorkspace()));
        } elseif (!$this->authorization->isGranted('ROLE_ADMIN') && (empty($options['filters']) || empty($options['filters']['organizations']))) {
            $options['hiddenFilters']['organizations'] = $this->getOrganizations();
        }

        $event->setData(
            $this->finder->search(Event::class, $options)
        );

        $event->stopPropagation();
    }

    private function getOrganizations(): array
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if ($user instanceof User) {
            return array_map(function (Organization $organization) {
                return $organization->getUuid();
            }, $user->getOrganizations());
        }

        return [];
    }
}
