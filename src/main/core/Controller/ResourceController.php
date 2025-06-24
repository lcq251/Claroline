<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Resource\ResourceProvider;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\Directory;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceRights;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Event\CatalogEvents\ResourceEvents;
use Claroline\CoreBundle\Event\Resource\CreateResourceEvent;
use Claroline\CoreBundle\Event\Resource\UpdateResourceEvent;
use Claroline\CoreBundle\Library\Normalizer\TextNormalizer;
use Claroline\CoreBundle\Manager\Resource\ResourceRestrictionsManager;
use Claroline\CoreBundle\Manager\Resource\RightsManager;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\CoreBundle\Security\Collection\ResourceCollection;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CoreBundle\Security\PlatformRoles;
use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

/**
 * Manages platform resources.
 * ATTENTION. Be careful if you change routes order.
 */
#[Route(path: '/resources')]
class ResourceController
{
    use RequestDecoderTrait;
    use PermissionCheckerTrait;

    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly SerializerProvider $serializer,
        private readonly ResourceProvider $resourceProvider,
        private readonly ResourceManager $manager,
        private readonly ResourceRestrictionsManager $restrictionsManager,
        private readonly ObjectManager $om,
        AuthorizationCheckerInterface $authorization,
        private readonly Crud $crud,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly RightsManager $rightsManager
    ) {
        $this->authorization = $authorization;
    }

    /**
     * Opens a resource.
     */
    #[Route(path: '/load/{id}', name: 'claro_resource_load', methods: ['GET'])]
    #[Route(path: '/load/{id}/embedded/{embedded}', name: 'claro_resource_load_embedded', methods: ['GET'])]
    public function openAction(string $id, int $embedded = 0): JsonResponse
    {
        /** @var ResourceNode $resourceNode */
        $resourceNode = $this->om->getRepository(ResourceNode::class)->findOneByUuidOrSlug($id);
        if (!$resourceNode) {
            return new JsonResponse('Resource not found.', 404);
        }

        if ($this->authorization->isGranted('OPEN', $resourceNode)) {
            $loaded = $this->manager->load($resourceNode, (bool) $embedded);

            return new JsonResponse(
                array_merge($loaded, [
                    'resourceNode' => $this->serializer->serialize($resourceNode, [Options::NO_RIGHTS]),
                ])
            );
        }

        // return the details of access errors to display it to users
        $userRoles = $this->tokenStorage->getToken()?->getRoleNames() ?? [PlatformRoles::ANONYMOUS];
        $accessErrors = $this->restrictionsManager->getErrors($resourceNode, $userRoles);

        return new JsonResponse([
            'resourceNode' => $this->serializer->serialize($resourceNode, [Options::NO_RIGHTS]),
            'accessErrors' => $accessErrors,
        ], 403);
    }

    #[Route(path: '/publish', name: 'claro_resource_publish', methods: ['PUT'])]
    public function publishAction(
        Request $request
    ): JsonResponse {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $data = $this->decodeRequest($request);

        $processed = [];

        $resourceNodes = $this->om->getRepository(ResourceNode::class)->findBy(['uuid' => $data]);
        foreach ($resourceNodes as $resourceNode) {
            if ($this->authorization->isGranted('EDIT', $resourceNode) && !$resourceNode->isPublished()) {
                $processed[] = $this->crud->update($resourceNode, [
                    'id' => $resourceNode->getUuid(),
                    'meta' => ['published' => true],
                ], [Crud::NO_PERMISSIONS, Crud::NO_VALIDATION]);
            }
        }

        return new JsonResponse(array_map(function (ResourceNode $resourceNode) {
            return $this->serializer->serialize($resourceNode);
        }, $processed));
    }

    #[Route(path: '/unpublish', name: 'claro_resource_unpublish', methods: ['PUT'])]
    public function unpublishAction(
        Request $request
    ): JsonResponse {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $resourceIds = $this->decodeRequest($request);

        $processed = [];

        $resourceNodes = $this->om->getRepository(ResourceNode::class)->findBy(['uuid' => $resourceIds]);
        foreach ($resourceNodes as $resourceNode) {
            if ($this->authorization->isGranted('EDIT', $resourceNode) && $resourceNode->isPublished()) {
                $processed[] = $this->crud->update($resourceNode, [
                    'id' => $resourceNode->getUuid(),
                    'meta' => ['published' => false],
                ], [Crud::NO_PERMISSIONS, Crud::NO_VALIDATION]);
            }
        }

        return new JsonResponse(array_map(function (ResourceNode $resourceNode) {
            return $this->serializer->serialize($resourceNode);
        }, $processed));
    }

    #[Route(path: '/', name: 'claro_resource_delete', methods: ['DELETE'])]
    public function deleteBulkAction(Request $request): JsonResponse
    {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $resourceIds = $this->decodeRequest($request);
        $resourceNodes = $this->om->getRepository(ResourceNode::class)->findBy(['uuid' => $resourceIds]);

        $this->om->startFlushSuite();

        foreach ($resourceNodes as $resourceNode) {
            $this->crud->delete($resourceNode);
        }

        $this->om->endFlushSuite();

        return new JsonResponse(null, 204);
    }

    /**
     * Embeds a resource inside a rich text content.
     */
    #[Route(path: '/embed/{id}', name: 'claro_resource_embed', methods: ['GET'])]
    public function embedAction(ResourceNode $resourceNode): Response
    {
        return new Response($this->manager->embed($resourceNode));
    }

    /**
     * Downloads a list of Resources.
     */
    #[Route(path: '/download', name: 'claro_resource_download', methods: ['GET'])]
    public function downloadAction(Request $request): JsonResponse|BinaryFileResponse
    {
        $nodes = $this->decodeIdsString($request, ResourceNode::class);

        $collection = new ResourceCollection($nodes);
        if (!$this->authorization->isGranted('EXPORT', $collection)) {
            throw new AccessDeniedException($collection->getErrorsForDisplay());
        }

        $data = $this->manager->download($nodes);

        $file = $data['file'];
        $fileName = $data['name'];

        if (!file_exists($file)) {
            return new JsonResponse('File not found.', 500);
        }

        if ($fileName) {
            $ext = pathinfo($fileName, PATHINFO_EXTENSION);
            $fileName = TextNormalizer::toKey(str_replace('.'.$ext, '', $fileName)).'.'.$ext;
        }

        return new BinaryFileResponse($file, 200, [
            'Content-Disposition' => "attachment; filename={$fileName}",
        ]);
    }

    /**
     * Submit access code.
     */
    #[Route(path: '/unlock/{id}', name: 'claro_resource_unlock', methods: ['POST'])]
    public function unlockAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $resourceNode,
        Request $request
    ): JsonResponse {
        $this->restrictionsManager->unlock($resourceNode, json_decode($request->getContent(), true)['code']);

        return new JsonResponse(null, 204);
    }

    /**
     * Checks if a resource is creatable for the submitted file.
     */
    #[Route(path: '/check/file', name: 'claro_resource_check_file', methods: ['POST'])]
    public function checkFileAction(Request $request): JsonResponse
    {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $files = $request->files->all();

        foreach ($files as $file) {
            $fileData = $this->resourceProvider->fromFile($file);
            if (empty($fileData)) {
                return new JsonResponse(null, 404);
            }

            return new JsonResponse($fileData);
        }

        return new JsonResponse(null, 404);
    }

    /**
     * Checks if a resource is creatable for the submitted url.
     */
    #[Route(path: '/check/url', name: 'claro_resource_check_url', methods: ['POST'])]
    public function checkUrlAction(Request $request): JsonResponse
    {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $urls = $this->decodeRequest($request);

        foreach ($urls as $url) {
            $urlData = $this->resourceProvider->fromUrl($url);
            if (empty($urlData)) {
                return new JsonResponse(null, 404);
            }

            return new JsonResponse($urlData);
        }

        return new JsonResponse(null, 404);
    }

    #[Route(path: '/copy/{destinationId}', name: 'claro_resource_copy', methods: ['POST'])]
    public function copyAction(
        #[MapEntity(mapping: ['destinationId' => 'uuid'])]
        ResourceNode $destination,
        Request $request
    ): JsonResponse {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $processed = [];

        $resourceIds = $this->decodeRequest($request);
        $toCopy = $this->om->getRepository(ResourceNode::class)->findBy(['uuid' => $resourceIds]);

        foreach ($toCopy as $resource) {
            // checks if the current user can copy the selected resource AND can create in the target directory
            $collection = new ResourceCollection([$destination], ['type' => $resource->getType()]);

            if ($this->checkPermission('COPY', $resource) && $this->checkPermission('CREATE', $collection)) {
                $processed[] = $this->crud->copy($resource, [Options::NO_RIGHTS, Crud::NO_PERMISSIONS], ['parent' => $destination]);
            }
        }

        return new JsonResponse(array_map(function (ResourceNode $resourceNode) {
            return $this->serializer->serialize($resourceNode);
        }, $processed));
    }

    #[Route(path: '/move/{destinationId}', name: 'claro_resource_move', methods: ['PUT'])]
    public function moveAction(
        #[MapEntity(mapping: ['destinationId' => 'uuid'])]
        ResourceNode $destination,
        Request $request
    ): JsonResponse {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $processed = [];

        $resourceIds = $this->decodeRequest($request);
        $toMove = $this->om->getRepository(ResourceNode::class)->findBy(['uuid' => $resourceIds]);

        foreach ($toMove as $resource) {
            // checks if the current user can copy the selected resource AND can create in the target directory
            $collection = new ResourceCollection([$destination], ['type' => $resource->getType()]);

            if ($this->checkPermission('ADMINISTRATE', $resource) && $this->checkPermission('CREATE', $collection)) {
                $processed[] = $this->manager->move($resource, $destination);
            }
        }

        return new JsonResponse(array_map(function (ResourceNode $resourceNode) {
            return $this->serializer->serialize($resourceNode);
        }, $processed));
    }

    #[Route(path: '/{parentId}', name: 'claro_resource_create', methods: ['POST'])]
    public function createAction(
        #[MapEntity(mapping: ['parentId' => 'uuid'])]
        ResourceNode $parent,
        Request $request
    ): JsonResponse {
        $data = $this->decodeRequest($request);
        $nodeData = $data['resourceNode'];
        $resourceData = !empty($data['resource']) ? $data['resource'] : [];

        // checks if the current user can add
        $collection = new ResourceCollection([$parent], ['type' => $nodeData['meta']['type']]);
        $this->checkPermission('CREATE', $collection, [], true);

        $this->om->startFlushSuite();

        // initialize resource node Entity
        try {
            $resourceNode = new ResourceNode();
            $resourceNode->setParent($parent);
            $resourceNode->setWorkspace($parent->getWorkspace());

            $this->crud->create($resourceNode, $nodeData, [Options::NO_RIGHTS, Options::PERSIST_TAG]);
        } catch (InvalidDataException $e) {
            // for resource creation we submit the resourceNode and resource data at once
            // we need to update the errors path for correct rendering in form
            $errors = array_map(function (array $error) {
                return [
                    'path' => 'resourceNode/'.ltrim($error['path'], '/'),
                    'message' => $error['message'],
                ];
            }, $e->getErrors());

            throw new InvalidDataException(sprintf('%s is not valid', ResourceNode::class), $errors);
        }

        // initialize custom resource Entity
        $resourceClass = $resourceNode->getResourceType()->getClass();

        try {
            /** @var AbstractResource $resource */
            $resource = new $resourceClass();
            $resource->setResourceNode($resourceNode);

            $this->crud->create($resource, $resourceData, [Options::PERSIST_TAG]);
        } catch (InvalidDataException $e) {
            // for resource creation we submit the resourceNode and resource data at once
            // we need to update the errors path for correct rendering in form
            $errors = array_map(function (array $error) {
                return [
                    'path' => 'resource/'.ltrim($error['path'], '/'),
                    'message' => $error['message'],
                ];
            }, $e->getErrors());

            throw new InvalidDataException(sprintf('%s is not valid', $resourceClass), $errors);
        }

        $this->om->endFlushSuite();

        $createResource = new CreateResourceEvent($resource, [
            'resourceNode' => $nodeData,
            'resource' => $resourceData,
        ]);
        $this->eventDispatcher->dispatch($createResource, ResourceEvents::getEventName(ResourceEvents::CREATE, $resourceNode->getResourceType()->getName()));

        // initialize resource rights
        if (!empty($nodeData['rights'])) {
            foreach ($nodeData['rights'] as $rights) {
                /** @var Role $role */
                $role = $this->om->getRepository(Role::class)->findOneBy(['name' => $rights['name']]);

                $creation = [];
                if (!empty($rights['permissions']['create']) && $resource instanceof Directory) {
                    // only forward creation rights to resource which can handle it (only directories atm)
                    $creation = $rights['permissions']['create'];
                }
                $this->rightsManager->update($rights['permissions'], $role, $resourceNode, false, $creation);
            }
        } else {
            // copy parent rights on the new resource
            $this->rightsManager->copy($parent, $resourceNode);
        }

        return new JsonResponse([
            'resourceNode' => $this->serializer->serialize($resourceNode),
            'resource' => $this->serializer->serialize($resource),
        ], 201);
    }

    #[Route(path: '/{id}', name: 'claro_resource_update', methods: ['PUT'])]
    public function updateAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $resourceNode,
        Request $request
    ): JsonResponse {
        $this->checkPermission('EDIT', $resourceNode, [], true);

        $resource = $this->om
            ->getRepository($resourceNode->getClass())
            ->findOneBy(['resourceNode' => $resourceNode]);

        $data = $this->decodeRequest($request);

        $isManager = $this->authorization->isGranted('ADMINISTRATE', $resourceNode);
        if (!empty($data)) {
            $this->om->startFlushSuite();

            if (!empty($data['resourceNode'])) {
                try {
                    $this->crud->update($resourceNode, $data['resourceNode'], [Options::PERSIST_TAG]);
                } catch (InvalidDataException $e) {
                    // for resource edit we submit the resourceNode and resource data at once
                    // we need to update the errors path for correct rendering in form
                    $errors = array_map(function (array $error) {
                        return [
                            'path' => 'resourceNode/'.ltrim($error['path'], '/'),
                            'message' => $error['message'],
                        ];
                    }, $e->getErrors());

                    throw new InvalidDataException(sprintf('%s is not valid', ResourceNode::class), $errors);
                }
            }

            if (!empty($data['resource'])) {
                try {
                    $this->crud->update($resource, $data['resource'], [Options::PERSIST_TAG]);
                } catch (InvalidDataException $e) {
                    // for resource edit we submit the resourceNode and resource data at once
                    // we need to update the errors path for correct rendering in form
                    $errors = array_map(function (array $error) {
                        return [
                            'path' => 'resource/'.ltrim($error['path'], '/'),
                            'message' => $error['message'],
                        ];
                    }, $e->getErrors());

                    throw new InvalidDataException(sprintf('%s is not valid', get_class($resource)), $errors);
                }
            }

            if (!empty($data['rights']) && $isManager) {
                $this->crud->update($resourceNode, ['rights' => $data['rights']]);
            }

            $this->om->endFlushSuite();
        }

        $updateResource = new UpdateResourceEvent($resource, $data);
        $this->eventDispatcher->dispatch($updateResource, ResourceEvents::getEventName(ResourceEvents::UPDATE, $resourceNode->getResourceType()->getName()));

        $this->om->refresh($resourceNode);

        return new JsonResponse(array_merge([], $updateResource->getResponse(), [
            'resource' => $this->serializer->serialize($resource),
            'resourceNode' => $this->serializer->serialize($resourceNode, [Options::NO_RIGHTS]),
            'rights' => !empty($data['rights']) && $isManager ? array_map(function (ResourceRights $rights) {
                return $this->serializer->serialize($rights);
            }, $resourceNode->getRights()->toArray()) : [],
        ]));
    }
}
