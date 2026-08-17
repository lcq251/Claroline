<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CursusBundle\Entity\EventPresence;
use Claroline\CursusBundle\Entity\Session;
use Claroline\CursusBundle\Entity\SessionUser;
use Claroline\NotificationBundle\Entity\Notification;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Aggregates the runtime data of the desktop dashboard widgets (C-22).
 */
class DashboardStatsManager
{
    private const BYTES_PER_GB = 1073741824;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly PlatformConfigurationHandler $config,
        private readonly AuthorizationCheckerInterface $authChecker
    ) {
    }

    public function getBoardData(): array
    {
        $user = $this->getCurrentUser();

        if ($user && $this->hasWorkspaceManagerRole($user)) {
            return [
                'greeting' => ['sub' => 'dashboard_greeting_teacher_sub'],
                'stats' => [
                    'teacher' => $this->getTeacherStats(),
                    'student' => null,
                ],
            ];
        }

        if ($user && $this->hasWorkspaceCollaboratorRole($user)) {
            return [
                'greeting' => ['sub' => 'dashboard_greeting_student_sub'],
                'stats' => [
                    'teacher' => null,
                    'student' => $this->getStudentStats($user),
                ],
            ];
        }

        return [
            'greeting' => ['sub' => null],
            'stats' => [
                'teacher' => null,
                'student' => null,
            ],
        ];
    }

    public function getMessages(int $maxItems): array
    {
        $user = $this->getCurrentUser();

        if (!$user) {
            return [];
        }

        $notifications = $this->om->getRepository(Notification::class)->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC'],
            max($maxItems, 1)
        );

        return array_map(function (Notification $notification) {
            return [
                'id' => (string) $notification->getId(),
                'title' => $notification->getMessage() ?? '',
                'description' => null,
                'type' => 'other',
                'unread' => true,
                'time' => $notification->getCreatedAt()?->format('c'),
                'url' => null,
            ];
        }, $notifications);
    }

    public function getFees(int $maxItems): array
    {
        $sessions = $this->om->getRepository(Session::class)->createQueryBuilder('s')
            ->where('s.publicRegistration = :open OR s.autoRegistration = 1')
            ->orderBy('s.startDate', 'DESC')
            ->setMaxResults(max($maxItems, 1))
            ->setFirstResult(0)
            ->getQuery()
            ->getResult();

        $sessionsFiltered = [];
        foreach ($sessions as $session) {
            if ($session->getName()) {
                $sessionsFiltered[] = $session;
            }
        }

        $now = new \DateTime();

        return array_map(function (Session $session) use ($now) {
            $startDate = $session->getStartDate();
            $status = 'open';
            if ($startDate && $startDate < $now) {
                $status = 'started';
            } elseif ($startDate && $startDate > \DateTime::createFromInterface($now)->modify('+7 days')) {
                $status = 'soon';
            }

            return [
                'course' => $session->getName(),
                'price' => 0,
                'currency' => 'CNY',
                'status' => $status,
                'url' => null,
            ];
        }, array_slice($sessionsFiltered, 0, max($maxItems, 1)));
    }

    public function getIncome(): array
    {
        return [
            'status' => 'pending',
            'income' => null,
            'cost' => null,
        ];
    }

    /**
     * Returns the workspace tree for the current user.
     *
     * @return array{maxResources: int, tree: array}
     */
    public function getWorkspaceTree(): array
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return ['maxResources' => 5, 'tree' => []];
        }

        $max = $this->config->getParameter('mindme_ai.dashboard.workspace_tree_max_resources') ?? 5;
        $userRoles = $user->getRoles();

        $workspaceRepo = $this->om->getRepository(Workspace::class);
        $workspaces = $workspaceRepo->createQueryBuilder('w')
            ->join('w.roles', 'r')
            ->where('r.name IN (:roles)')
            ->andWhere('w.model = :model')
            ->setParameter('roles', $userRoles)
            ->setParameter('model', false)
            ->orderBy('w.name', 'ASC')
            ->getQuery()
            ->getResult();

        $resourceRepo = $this->om->getRepository(ResourceNode::class);

        $tree = [];
        foreach ($workspaces as $ws) {
            $rootResources = $resourceRepo->findBy(
                ['workspace' => $ws, 'parent' => null, 'active' => true],
                ['name' => 'ASC']
            );

            $accessible = [];
            foreach ($rootResources as $res) {
                if ($this->authChecker->isGranted('OPEN', $res)) {
                    $accessible[] = [
                        'id' => $res->getUuid(),
                        'name' => $res->getName(),
                        'type' => $res->getResourceType()->getName(),
                        'url' => '/workspace/'.$ws->getSlug().'/resources/'.$res->getSlug(),
                    ];
                }
            }

            $tree[] = [
                'id' => $ws->getUuid(),
                'name' => $ws->getName(),
                'code' => $ws->getCode(),
                'url' => '/workspace/'.$ws->getSlug(),
                'resources' => $accessible,
            ];
        }

        return [
            'maxResources' => $max,
            'tree' => $tree,
        ];
    }

    private function getCurrentUser(): ?User
    {
        $token = $this->tokenStorage->getToken();
        if (!$token) {
            return null;
        }
        $user = $token->getUser();
        if ($user instanceof \Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface
            || $user instanceof User
        ) {
            return $user;
        }
        return null;
    }

    private function hasWorkspaceManagerRole(User $user): bool
    {
        try {
            $managed = $this->om->getRepository(Workspace::class)
                ->findByRoles(['ROLE_WS_MANAGER']);
            return !empty($managed);
        } catch (\Throwable $e) {
            return false;
        }
    }

    private function hasWorkspaceCollaboratorRole(User $user): bool
    {
        try {
            $collaborators = $this->om->getRepository(Workspace::class)
                ->findByRoles(['ROLE_WS_COLLABORATOR']);
            return !empty($collaborators);
        } catch (\Throwable $e) {
            return false;
        }
    }

    private function hasWorkspaceRole(User $user, string $role): bool
    {
        foreach ($user->getRoles() as $userRole) {
            if ($role === $userRole || str_starts_with($userRole, $role . '_')) {
                return true;
            }
        }
        return false;
    }

    private function getTeacherStats(): array
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return ['courses' => null, 'sessions' => null, 'resources' => null];
        }

        $resourceRepo = $this->om->getRepository(ResourceNode::class);
        $totalResources = (int) $resourceRepo->count(['creator' => $user]);

        return [
            'courses' => 0,
            'sessions' => 0,
            'resources' => $totalResources,
        ];
    }

    private function getStudentStats(User $user): array
    {
        $sessionsCount = (int) $this->om->createQueryBuilder()
            ->select('COUNT(su.id)')
            ->from(SessionUser::class, 'su')
            ->where('su.user = :userId')
            ->setParameter('userId', $user->getId())
            ->getQuery()
            ->getSingleScalarResult();

        $resourceRepo = $this->om->getRepository(ResourceNode::class);
        $totalResources = (int) $resourceRepo->count(['workspace' => $user->getPersonalWorkspaceIdentifier()]);

        $badgesCount = 0;
        try {
            $assertionRepo = $this->om->getRepository(Assertion::class);
            $badgesCount = (int) $assertionRepo->count(['recipient' => $user]);
        } catch (\Throwable) {
            $badgesCount = 0;
        }

        return [
            'courses_registered' => $sessionsCount,
            'courses_completed' => 0,
            'resources_published' => $totalResources,
            'apps_published' => 0,
            'badges' => $badgesCount,
            'attendance' => null,
        ];
    }
}