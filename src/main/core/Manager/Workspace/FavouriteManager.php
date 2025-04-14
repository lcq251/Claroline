<?php

namespace Claroline\CoreBundle\Manager\Workspace;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Entity\Workspace\WorkspaceFavourite;

class FavouriteManager
{
    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    /**
     * Get the list of favorite workspaces for a user.
     *
     * @return Workspace[]
     */
    public function getWorkspaces(User $user): array
    {
        $workspaces = $this->om
            ->getRepository(WorkspaceFavourite::class)
            ->findBy(['user' => $user]);

        return array_map(function (WorkspaceFavourite $favourite) {
            return $favourite->getWorkspace();
        }, $workspaces);
    }

    /**
     * Creates a favourite for given user and workspace.
     */
    public function createWorkspaceFavourite(User $user, Workspace $workspace): void
    {
        $favourite = $this->om->getRepository(WorkspaceFavourite::class)->findOneBy([
            'user' => $user,
            'workspace' => $workspace,
        ]);

        if (empty($favourite)) {
            $favourite = new WorkspaceFavourite();
            $favourite->setUser($user);
            $favourite->setWorkspace($workspace);

            $this->om->persist($favourite);
            $this->om->flush();
        }
    }

    /**
     * Deletes favourite for given user and workspace.
     */
    public function deleteWorkspaceFavourite(User $user, Workspace $workspace): void
    {
        $favourite = $this->om->getRepository(WorkspaceFavourite::class)->findOneBy([
            'user' => $user,
            'workspace' => $workspace,
        ]);

        if (!empty($favourite)) {
            $this->om->remove($favourite);
            $this->om->flush();
        }
    }
}
