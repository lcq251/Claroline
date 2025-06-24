<?php

namespace Claroline\CoreBundle\Controller\Resource;

use Claroline\AppBundle\API\Finder\FinderQuery;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceRights;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Resource\RightsManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CoreBundle\Security\PlatformRoles;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

#[Route(path: '/resource', name: 'apiv2_resource_')]
class ResourceNodeController extends AbstractCrudController
{
    use PermissionCheckerTrait;

    public function __construct(
        private readonly RightsManager $rightsManager,
        private readonly TokenStorageInterface $token,
        AuthorizationCheckerInterface $authorization
    ) {
        $this->authorization = $authorization;
    }

    public static function getName(): string
    {
        return 'resource_node';
    }

    public static function getClass(): string
    {
        return ResourceNode::class;
    }

    public function getIgnore(): array
    {
        return ['list', 'update', 'create'];
    }

    #[Route(path: '/{id}/rights', name: 'get_rights', methods: ['GET'])]
    public function getRightsAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $resourceNode
    ): JsonResponse {
        $this->checkPermission('ADMINISTRATE', $resourceNode, [], true);

        return new JsonResponse(array_map(function (ResourceRights $rights) {
            return $this->serializer->serialize($rights);
        }, $resourceNode->getRights()->toArray()));
    }

    #[Route(path: '/{contextId}/{parent}', name: 'list', defaults: ['contextId' => null, 'parent' => null], methods: ['GET'])]
    public function listAction(
        #[MapQueryString]
        ?FinderQuery $finderQuery = new FinderQuery(),
        ?string $contextId = null,
        ?string $parent = null
    ): StreamedJsonResponse {
        $finderQuery->addFilters([
            'active' => true,
            'resourceTypeEnabled' => true,
        ]);

        if ($contextId || $parent) {
            if (!$parent) {
                $parentNode = $this->om->getRepository(ResourceNode::class)->findWorkspaceRoot($contextId);
            } else {
                $parentNode = $this->om->getRepository(ResourceNode::class)->findOneByUuidOrSlug($parent);
            }

            // grab directory content
            if ($parentNode) {
                $finderQuery->addFilter('parent', $parentNode->getUuid());

                if (!$this->authorization->isGranted('ADMINISTRATE', $parentNode)) {
                    $finderQuery->addFilter('published', true);
                }
            }
        }

        $roles = $this->token->getToken()?->getRoleNames() ?? [PlatformRoles::ANONYMOUS];
        if (!in_array(PlatformRoles::ADMIN, $roles) || !$finderQuery->hasFilter('parent')) {
            $finderQuery->addFilter('roles', $roles);
        }

        $options = static::getOptions();
        $results = $this->crud->search(static::getClass(), $finderQuery, $options['list'] ?? []);

        return $results->toResponse();
    }

    #[Route(path: '/{workspace}/removed', name: 'workspace_removed_list', methods: ['GET'])]
    public function listRemovedAction(
        #[MapEntity(mapping: ['workspace' => 'uuid'])]
        Workspace $workspace,
        Request $request
    ): JsonResponse {
        return new JsonResponse(
            $this->crud->list(ResourceNode::class,
                array_merge($request->query->all(), ['hiddenFilters' => [
                    'workspace' => $workspace->getUuid(),
                    'active' => false,
                ]])
            )
        );
    }

    public static function getOptions(): array
    {
        return array_merge(parent::getOptions(), [
            'list' => [Options::NO_RIGHTS, Options::SERIALIZE_LIST],
            'get' => [Options::NO_RIGHTS],
            'update' => [Options::NO_RIGHTS],
        ]);
    }
}
