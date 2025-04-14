<?php

namespace Claroline\CoreBundle\Controller\Workspace;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Workspace\FavouriteManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Allows authenticated user to manage its favourite workspaces.
 */
#[Route(path: '/workspace/favourite', name: 'apiv2_workspace_favourite_')]
class FavouriteController
{
    use PermissionCheckerTrait;
    use RequestDecoderTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer,
        private readonly FavouriteManager $manager
    ) {
        $this->authorization = $authorization;
    }

    /**
     * Gets the current user favourites.
     */
    #[Route(path: '/', name: 'list', methods: ['GET'])]
    public function listAction(#[CurrentUser] ?User $user = null): JsonResponse
    {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $workspaces = $this->manager->getWorkspaces($user);

        return new JsonResponse(array_map(function (Workspace $workspace) {
            return $this->serializer->serialize($workspace, [SerializerInterface::SERIALIZE_MINIMAL]);
        }, $workspaces));
    }

    /**
     * Adds a workspace to the current user favorites.
     */
    #[Route(path: '/{id}', name: 'create', methods: ['POST'])]
    public function createAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Workspace $workspace,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $this->manager->createWorkspaceFavourite($user, $workspace);

        return new JsonResponse(null, 201);
    }

    /**
     * Removes a workspace from the current user favorites.
     */
    #[Route(path: '/{id}', name: 'delete', methods: ['DELETE'])]
    public function deleteAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Workspace $workspace,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $this->manager->deleteWorkspaceFavourite($user, $workspace);

        return new JsonResponse(null, 204);
    }
}
