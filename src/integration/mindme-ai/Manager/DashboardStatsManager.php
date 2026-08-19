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
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\Registration\SessionUser;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Provides runtime data for dashboard homepage blocks: workspace-tree, overview, messages.
 */
class DashboardStatsManager
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly PlatformConfigurationHandler $config,
        private readonly AuthorizationCheckerInterface $authChecker
    ) {
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
        $workspaces = $workspaceRepo
            ->createQueryBuilder('w')
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
                        'id'    => $res->getUuid(),
                        'name'  => $res->getName(),
                        'type'  => $res->getResourceType()->getName(),
                        'url'   => '/workspace/'.$ws->getSlug().'/resources/'.$res->getSlug(),
                    ];
                }
            }

            $tree[] = [
                'id'        => $ws->getUuid(),
                'name'      => $ws->getName(),
                'code'      => $ws->getCode(),
                'url'       => '/workspace/'.$ws->getSlug(),
                'resources' => $accessible,
            ];
        }

        return [
            'maxResources' => $max,
            'tree'         => $tree,
        ];
    }

    public function getOverviewData(): array
    {
        $user = $this->getCurrentUser();

        if (!$user) {
            return [
                'resources' => ['total' => 0, 'published' => 0, 'subscribed' => 0],
                'courses'   => ['total' => 0, 'published' => 0, 'subscribed' => 0],
                'tools'     => ['total' => 0, 'published' => 0, 'subscribed' => 0],
                'subscriptions' => ['resources' => 0, 'courses' => 0, 'tools' => 0, 'total' => 0],
            ];
        }

        $resRepo    = $this->om->getRepository(ResourceNode::class);
        $courseRepo = $this->om->getRepository(Course::class);
        $lessonRepo = $this->om->getRepository(AiLesson::class);

        $resourcesTotal     = (int) $resRepo->count([]);
        $resourcesPublished = (int) $resRepo->count(['creator' => $user]);

        $userRoles = $user->getRoles();
        $wsRepo    = $this->om->getRepository(Workspace::class);
        $wsIds = $wsRepo->createQueryBuilder('w')
            ->select('w.id')
            ->join('w.roles', 'r')
            ->where('r.name IN (:roles)')
            ->andWhere('w.model = false')
            ->setParameter('roles', $userRoles)
            ->getQuery()
            ->getScalarResult();
        $wsIdList = array_column($wsIds, 'id');

        $resourcesSubscribed = 0;
        if (!empty($wsIdList)) {
            $resourcesSubscribed = (int) $resRepo->createQueryBuilder('r')
                ->select('COUNT(r.id)')
                ->where('r.workspace IN (:ws)')
                ->setParameter('ws', $wsIdList)
                ->getQuery()
                ->getSingleScalarResult();
        }

        $coursesTotal       = (int) $courseRepo->count([]);
        $coursesPublished   = (int) $courseRepo->count(['creator' => $user]);
        $coursesSubscribed  = (int) $this->om->getRepository(SessionUser::class)
            ->count(['user' => $user]);

        $toolsTotal         = (int) $lessonRepo->count([]);
        $toolsPublished     = (int) $lessonRepo->count(['creator' => $user]);
        $toolsSubscribed    = 0;

        $subTotal = $resourcesSubscribed + $coursesSubscribed;

        return [
            'resources' => [
                'total'      => $resourcesTotal,
                'published'  => $resourcesPublished,
                'subscribed' => $resourcesSubscribed,
            ],
            'courses' => [
                'total'      => $coursesTotal,
                'published'  => $coursesPublished,
                'subscribed' => $coursesSubscribed,
            ],
            'tools' => [
                'total'      => $toolsTotal,
                'published'  => $toolsPublished,
                'subscribed' => $toolsSubscribed,
            ],
            'subscriptions' => [
                'resources' => $resourcesSubscribed,
                'courses'   => $coursesSubscribed,
                'tools'     => $toolsSubscribed,
                'total'     => $subTotal,
            ],
        ];
    }

    /**
     * Returns overview block data: stats cards + quick links.    /**
     * Returns overview block data: stats cards + quick links.
     *
     * @return array
     */
    public function getOverview(): array
    {
        $user = $this?->getCurrentUser();
        if (!$user) {
            return [
                'stats' => [
                    ['label' => 'workspaces', 'value' => 0, 'icon' => 'fa fa-people'],
                    ['label' => 'resources',  'value' => 0, 'icon' => 'fa fa-file-text'],
                    ['label' => 'courses',    'value' => 0, 'icon' => 'fa fa-book'],
                ],
                'announcements' => [],
            ];
        }

        $userRoles   = $user->getRoles();
        $wsRepo      = $this->om->getRepository(Workspace::class);
        $resRepo     = $this->om->getRepository(ResourceNode::class);

        // counts
        $workspaceCount = (int) $wsRepo
            ->createQueryBuilder('w')
                ->join('w.roles', 'r')
                ->where('r.name IN (:roles)')
                ->andWhere('w.model = false')
                ->setParameter('roles', $userRoles)
                ->count();

        // courses via course workspace relation is heavier; use a query that works on most schemas
        try {
            $courseCount = (int) ($this->om->getRepository(\Claroline\CoreBundle\Entity\Course\Course::class))
                ->createQueryBuilder('c')
                    ->join('c.mainWorkspace', 'mw')
                    ->join('mw.roles', 'r')
                    ->where('r.name IN (:roles)')
                    ->setParameter('roles', $userRoles)
                    ->count();
        } catch (\Throwable $_e) {
            $courseCount = 0;
        }

        // recent announcements (platform default)
        $announcements = [];
        try {
            $boardRepo = $this->om->getRepository(\Claroline\ApiBundle\Entity\Api\AnnouncementBoard::class);
            if (method_exists($boardRepo, 'findBy')) {
                $boards = $boardRepo->findBy([], ['dateStart' => 'DESC'], 3);
                foreach ($boards as $b) {
                    $announcements[] = [
                        'id'       => $b->getId(),
                        'title'    => $b->getTitle() ?? 'Announcement',
                        'url'      => '/api/announcement/' . $b->getSlug(),
                        'dateStart'=> $b->getDateStart()->format('Y-m-d'),
                    ];
                }
            }
        } catch (\Throwable $_) {
            // API entity may not always be available; fall through empty.
        }

        return [
            'stats' => [
                ['label' => 'workspaces', 'value' => $workspaceCount, 'icon' => 'fa fa-people'],
                ['label' => 'resources',  'value' => (int) $resRepo->count([]), 'icon' => 'fa fa-file-text'],
                ['label' => 'courses',    'value' => $courseCount, 'icon' => 'fa fa-book'],
            ],
            'announcements' => $announcements,
        ];
    }

    /**
     * Returns messages block data: recent platform notifications / messages.
     *
     * @return array{items: array, moreUrl?: string}
     */
    public function getMessages(): array
    {
        $user = $this?->getCurrentUser();
        if (!$user) {
            return [
                'items' => [],
                'moreUrl' => '/notifications',
            ];
        }

        $items = [];
        try {
            // Claroline Community Notifications as the primary source
            $notifRepo = $this->om->getRepository(
                \Claroline\CoreBundle\Entity\Notification\UserNotification::class ?? null
            );
            if ($notifRepo) {
                $notifs = $notifRepo
                    ->createQueryBuilder('un')
                        ->where('un.user = :user')
                        ->andWhere('un.readable = true')
                        ->orderBy('un.dateUpdate', 'DESC')
                        ->setParameter('user', $user->getId())
                        ->setMaxResults(10)
                        ->getQuery()
                        ->getResult();

                foreach ($notifs as $n) {
                    $items[] = [
                        'id'     => $n->getId(),
                        'title'  => $n->getTitle() ?? 'Notification',
                        'body'   => strip_tags($n->getBody() ?? ''),
                        'date'   => $n->getDateUpdate()->format('Y-m-d H:i'),
                        'read'   => (bool) $n->getRead(),
                        'type'   => $n->getType() ?? 'info',
                        'url'    => $n->getUrl() ?? '/notifications',
                    ];
                }
            }
        } catch (\Throwable $_) {
            // Notification entity/schema not present.
        }

        return [
            'items'   => $items,
            'moreUrl' => '/notifications',
        ];
    }

    private function getCurrentUser(): ?User
    {
        $token = $this->tokenStorage->getToken();
        if (!$token) {
            return null;
        }

        $user = $token->getUser();
        while ($user instanceof \Symfony\Component\Security\Core\User\EquivalentUserInterface) {
            $user = $user->getDecoratedUser();
        }
        // We can only accept User instances because they implement our security layer.
        if (
            !$user instanceof PasswordAuthenticatedUserInterface &&
            !$user instanceof User
        ) {
            return null;
        }

        return $user;
    }
}

