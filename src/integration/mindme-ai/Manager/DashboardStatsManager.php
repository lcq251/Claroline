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
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\EventPresence;
use Claroline\CursusBundle\Entity\Registration\SessionUser;
use Claroline\CursusBundle\Entity\Session;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\NotificationBundle\Entity\Notification;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Aggregates the runtime data of the desktop dashboard widgets (C-22).
 *
 * Role determination lives here (D9b): the platform decides whether the
 * current user gets the teacher or the student board, or neither. The
 * frontend never reads roles.
 *
 * Every query degrades gracefully: empty data sources return 0 / null
 * instead of throwing (Plan 19 acceptance criterion #3).
 */
class DashboardStatsManager
{
    private const BYTES_PER_GB = 1073741824;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly PlatformConfigurationHandler $config
    ) {
    }

    /**
     * Runtime data of the dashboard-board widget: greeting + role stats.
     *
     * Only one of teacher/student groups is filled, the other is always null
     * (other roles get both null -> frontend renders the "shared area only"
     * empty state or hides the whole widget).
     */
    public function getBoardData(): array
    {
        $user = $this->getCurrentUser();

        if ($user && $this->hasWorkspaceRole($user, 'ROLE_WS_MANAGER')) {
            return [
                'greeting' => ['sub' => 'dashboard_greeting_teacher_sub'],
                'stats' => [
                    'teacher' => $this->getTeacherStats(),
                    'student' => null,
                ],
            ];
        }

        if ($user && $this->hasWorkspaceRole($user, 'ROLE_WS_COLLABORATOR')) {
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

    /**
     * Recent notifications of the current user (dashboard-notifications).
     *
     * @return array<int, array<string, mixed>>
     */
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
                'id' => (string) $notification->getUuid(),
                'title' => $notification->getMessage() ?? '',
                'description' => null,
                'type' => 'other',
                'unread' => true,
                'time' => $notification->getCreatedAt()?->format('c'),
                'url' => null,
            ];
        }, $notifications);
    }

    /**
     * Priced courses/sessions ordered by start date (dashboard-fees).
     *
     * @return array<int, array<string, mixed>>
     */
    public function getFees(int $maxItems): array
    {
        $sessions = $this->om->getRepository(Session::class)->createQueryBuilder('s')
            ->where('s.price IS NOT NULL')
            ->andWhere('s.canceled = false')
            ->orderBy('s.startDate', 'DESC')
            ->setMaxResults(max($maxItems, 1))
            ->getQuery()
            ->getResult();

        $now = new \DateTime();

        return array_map(function (Session $session) use ($now) {
            return [
                'course' => $session->getName(),
                'price' => $session->getPrice(),
                'currency' => 'CNY',
                'status' => $this->getFeeStatus($session, $now),
                'url' => null,
            ];
        }, $sessions);
    }

    /**
     * Income/cost overview (dashboard-fees sub card).
     *
     * Billing is not connected yet (D3/U5): v1 always returns the pending
     * empty state and never fabricates a fake 0.
     *
     * @return array{status: string, income: null, cost: null}
     */
    public function getIncome(): array
    {
        return [
            'status' => 'pending',
            'income' => null,
            'cost' => null,
        ];
    }

    private function getCurrentUser(): ?User
    {
        $user = $this->tokenStorage->getToken()?->getUser();

        return $user instanceof User ? $user : null;
    }

    /**
     * Whether the user holds the given workspace role.
     *
     * Real workspace roles are scoped per workspace
     * (`ROLE_WS_MANAGER_<uuid>`), so a plain `in_array()` on the role name
     * never matches a live user. Accepts both the plain name (tests /
     * platform roles) and any of its workspace-scoped variants.
     */
    private function hasWorkspaceRole(User $user, string $role): bool
    {
        foreach ($user->getRoles() as $userRole) {
            if ($role === $userRole || str_starts_with($userRole, $role.'_')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Teacher board (ROLE_WS_MANAGER): 6 metrics over all workspaces.
     *
     * @return array<string, int|float|null>
     */
    private function getTeacherStats(): array
    {
        return [
            // U3: platform storage quota / used files size; null when not configured (frontend shows "—")
            'storage_total' => $this->getStorageTotalGb(),
            'storage_used' => $this->getStorageUsedGb(),
            'resources' => (int) $this->om->getRepository(ResourceNode::class)->count([]),
            // U1: AiLesson packaged instances, 0/framework for v1
            'apps' => (int) $this->om->getRepository(AiLesson::class)->count([]),
            'courses' => (int) $this->om->getRepository(Course::class)->count(['archived' => false]),
            'registrations' => (int) $this->om->getRepository(SessionUser::class)->count([]),
        ];
    }

    /**
     * Student board (ROLE_WS_COLLABORATOR): 6 personal metrics.
     *
     * @return array<string, int|float|null>
     */
    private function getStudentStats(User $user): array
    {
        return [
            'courses_registered' => (int) $this->om->getRepository(SessionUser::class)->count(['user' => $user]),
            // U4 (defined at implementation time): sessions the user registered to whose end date is in the past
            'courses_completed' => (int) $this->om->getRepository(SessionUser::class)->createQueryBuilder('su')
                ->join('su.session', 's')
                ->where('su.user = :user')
                ->andWhere('s.endDate IS NOT NULL')
                ->andWhere('s.endDate < :now')
                ->setParameter('user', $user)
                ->setParameter('now', new \DateTime())
                ->select('COUNT(su.id)')
                ->getQuery()
                ->getSingleScalarResult(),
            'resources_published' => (int) $this->om->getRepository(ResourceNode::class)->count(['creator' => $user]),
            // U1: 0/framework
            'apps_published' => 0,
            'badges' => (int) $this->om->getRepository(Assertion::class)->count(['recipient' => $user]),
            // no presence record -> null (frontend shows "—")
            'attendance' => $this->getAttendance($user),
        ];
    }

    /**
     * Overview block: stats cards (resources/courses/tools/storage) + progress bars.
     */
    public function getOverviewData(?string $workspaceId = null): array
    {
        $user = $this->getCurrentUser();

        if (!$user) {
            return [
                'resources' => ['published' => 0, 'subscribed' => 0],
                'courses'   => ['published' => 0, 'subscribed' => 0],
                'tools'     => ['published' => 0, 'subscribed' => 0],
                'storage'   => ['total' => 0.0, 'used' => 0.0],
            ];
        }

        $resRepo = $this->om->getRepository(ResourceNode::class);
        $crsRepo = $this->om->getRepository(Course::class);

        // resolve workspace scope
        $wsIds = [];
        if ($workspaceId) {
            $wsIds[] = $workspaceId;
        } else {
            $userRoles = $user->getRoles();
            $wsRows = $this->om->getRepository(Workspace::class)
                ->createQueryBuilder('w')
                    ->select('w.id')
                    ->join('w.roles', 'r')
                    ->where('r.name IN (:roles)')
                    ->andWhere('w.model = false')
                    ->setParameter('roles', $userRoles)
                    ->getQuery()
                    ->getScalarResult();
            $wsIds = array_column($wsRows, 'id');
        }

        // resources: published=creator=me; subscribed=in workspaces
        $resourcesPublished  = (int) $resRepo->count(['creator' => $user]);
        $resourcesSubscribed = 0;
        if (!empty($wsIds)) {
            $resourcesSubscribed = (int) $resRepo->createQueryBuilder('r')
                ->select('COUNT(r.id)')
                ->where('r.workspace IN (:ws)')
                ->setParameter('ws', $wsIds)
                ->getQuery()
                ->getSingleScalarResult();
        }

        // courses: published=creator=me; subscribed enrolled in ws or via SessionUser
        $coursesPublished  = (int) $crsRepo->count(['creator' => $user]);
        $coursesSubscribed = 0;
        if (!empty($wsIds)) {
            try {
                $coursesSubscribed = (int) ($this->om->getRepository(\Claroline\CoreBundle\Entity\Course\Course::class))
                    ->createQueryBuilder('c')
                        ->innerJoin('c.mainWorkspace', 'mw')
                        ->where('mw.id IN (:ws)')
                        ->setParameter('ws', $wsIds)
                        ->count();
            } catch (\Throwable $_e) {
                $coursesSubscribed = 0;
            }
        } else {
            $coursesSubscribed = (int) $this->om->getRepository(SessionUser::class)
                ->count(['user' => $user]);
        }

        // tools: ResourceNode with resourceType=claroline_web_resource
        $toolsPublished    = 0;
        $toolsSubscribed   = 0;
        if ($rtObj = $this->om->getRepository(ResourceType::class)
                ->findOneBy(['name' => 'claroline_web_resource'])) {
            $typeId = (int) $rtObj->getId();
            $toolsPublished = (int) $resRepo->createQueryBuilder('r')
                ->select('COUNT(r.id)')
                ->where('r.resourceType = :rt AND r.creator = :creator')
                ->setParameter('rt', $typeId)
                ->setParameter('creator', $user)
                ->getQuery()
                ->getSingleScalarResult();
            if (!empty($wsIds)) {
                $toolsSubscribed = (int) $resRepo->createQueryBuilder('r')
                    ->select('COUNT(r.id)')
                    ->where('r.resourceType = :rt AND r.workspace IN (:ws)')
                    ->setParameter('rt', $typeId)
                    ->setParameter('ws', $wsIds)
                    ->getQuery()
                    ->getSingleScalarResult();
            }
        }

        // storage as GB (round to 1 decimal)
        $storageTotal = (float) round($this->getStorageTotalGb() ?? 0, 1);
        $storageUsed  = (float) round($this->getStorageUsedGb() ?? 0, 1);

        return [
            'resources' => ['published' => $resourcesPublished, 'subscribed' => $resourcesSubscribed],
            'courses'   => ['published' => $coursesPublished, 'subscribed' => $coursesSubscribed],
            'tools'     => ['published' => $toolsPublished, 'subscribed' => $toolsSubscribed],
            'storage'   => ['total' => $storageTotal, 'used' => $storageUsed],
        ];
    }
    private function getStorageTotalGb(): ?float
        {
            $bytes = $this->config->getParameter('restrictions.storage');
    
            return null === $bytes ? null : round($bytes / self::BYTES_PER_GB, 1);
        }

    private function getStorageUsedGb(): ?float
    {
        $bytes = $this->config->getParameter('restrictions.used_storage');

        return null === $bytes ? null : round($bytes / self::BYTES_PER_GB, 1);
    }

    /**
     * EventPresence attendance percentage; null when the user has no presence record.
     */
    private function getAttendance(User $user): ?int
    {
        $repository = $this->om->getRepository(EventPresence::class);
        $total = $repository->count(['user' => $user]);

        if (0 === $total) {
            return null;
        }

        $present = $repository->count(['user' => $user, 'status' => EventPresence::PRESENT]);

        return (int) round($present / $total * 100);
    }

    private function getFeeStatus(Session $session, \DateTime $now): string
    {
        $startDate = $session->getStartDate();

        if ($startDate && $startDate <= $now) {
            return 'started';
        }

        if ($startDate && $startDate <= (clone $now)->modify('+7 days')) {
            return 'soon';
        }

        return 'open';
    }
}
