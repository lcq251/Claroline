<?php

namespace Claroline\CoreBundle\Controller\Model;

use Claroline\AppBundle\API\Crud;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Manages a group collection on an entity.
 */
trait HasGroupsTrait
{
    abstract protected function checkPermission($permission, $object = null, ?array $options = [], ?bool $throwException = false): bool;

    abstract public static function getClass(): string;

    abstract public static function getName(): string;

    #[Route(path: '/{id}/group', name: 'list_groups', methods: ['GET'], priority: 1)]
    public function listGroupsAction(string $id, #[CurrentUser] ?User $user, Request $request): JsonResponse
    {
        // no need to secure entrypoint, the CRUD will do it for us.

        $this->crud->get(static::getClass(), $id);

        $hiddenFilters = [
            // filter the list by the parent
            static::getName() => [$id],
        ];

        if (!$this->checkPermission('ROLE_ADMIN')) {
            // only list groups for the current user organizations
            $hiddenFilters['organizations'] = array_map(function (Organization $organization) {
                return $organization->getUuid();
            }, $user ? $user->getOrganizations() : []);
        }

        return new JsonResponse(
            $this->crud->list(Group::class, array_merge($request->query->all(), [
                'hiddenFilters' => $hiddenFilters,
            ]))
        );
    }

    #[Route(path: '/{id}/group', name: 'add_groups', methods: ['PATCH'], priority: 1)]
    public function addGroupsAction(string $id, Request $request): JsonResponse
    {
        // no need to secure entrypoint, the CRUD will do it for us.

        $object = $this->crud->get(static::getClass(), $id);

        $groups = $this->decodeIdsString($request, Group::class);
        $this->crud->patch($object, 'group', Crud::COLLECTION_ADD, $groups);

        return new JsonResponse(
            $this->serializer->serialize($object)
        );
    }

    #[Route(path: '/{id}/group', name: 'remove_groups', methods: ['DELETE'], priority: 1)]
    public function removeGroupsAction(string $id, Request $request): JsonResponse
    {
        // no need to secure entrypoint, the CRUD will do it for us.

        $object = $this->crud->get(static::getClass(), $id);

        $groups = $this->decodeIdsString($request, Group::class);
        $this->crud->patch($object, 'group', Crud::COLLECTION_REMOVE, $groups);

        return new JsonResponse($this->serializer->serialize($object));
    }
}
