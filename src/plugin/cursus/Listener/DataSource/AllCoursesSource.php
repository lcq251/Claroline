<?php

namespace Claroline\CursusBundle\Listener\DataSource;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\DataSource\GetDataEvent;
use Claroline\CursusBundle\Entity\Course;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class AllCoursesSource
{
    public function __construct(
        private readonly FinderProvider $finder,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly AuthorizationCheckerInterface $authorization
    ) {
    }

    public function getData(GetDataEvent $event): void
    {
        $options = $event->getOptions();
        $options['hiddenFilters']['hidden'] = false;

        if (!$this->authorization->isGranted('ROLE_ADMIN') && (empty($options['filters']) || empty($options['filters']['organizations']))) {
            $options['hiddenFilters']['organizations'] = $this->getOrganizations();
        }

        $event->setData(
            $this->finder->search(Course::class, $options)
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
