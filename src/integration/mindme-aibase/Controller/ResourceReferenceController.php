<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Mindme\AibaseBundle\Entity\Resource\ResourceReference;
use Mindme\AibaseBundle\Serializer\ResourceReferenceSerializer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Generic "resource as input of another resource" API.
 *
 * GET  - list the host's inputs, ordered by `entity_order`, each target
 *        checked against the current user's OPEN permission.
 * PUT  - full replacement of the input list. body = [targetUuid, ...],
 *        array order becomes the new entity_order. Unknown uuids skipped,
 *        duplicates dropped.
 * GET/PUT .../mine - the current user's personal links (userId-scoped rows).
 */
class ResourceReferenceController
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly ResourceReferenceSerializer $serializer,
        private readonly AuthorizationCheckerInterface $authorization,
        private readonly TokenStorageInterface $tokenStorage
    ) {
    }

    /**
     * Returns the host resource's inputs (ordered, per-target OPEN check).
     */
    #[Route('/apiv2/mindme_aibase/resource_reference/{hostId}/inputs', name: 'apiv2_mindme_aibase_resource_reference_inputs', methods: ['GET'])]
    public function list(string $hostId): JsonResponse
    {
        $host = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $hostId]);

        if (!$host) {
            return new JsonResponse(['message' => 'Host resource not found'], 404);
        }

        $references = $this->om->getRepository(ResourceReference::class)->findBy(
            ['host' => $host], ['order' => 'ASC']
        );

        $inputs = [];
        foreach ($references as $reference) {
            if ($reference->getUserId() !== null) {
                continue;
            }

            $target = $reference->getTarget();
            if ($target && !$this->authorization->isGranted('OPEN', $target)) {
                continue;
            }

            $inputs[] = $this->serializer->serialize($reference);
        }

        return new JsonResponse($inputs);
    }

    /**
     * Fully replaces the host resource's input list. body = [targetUuid, ...].
     */
    #[Route('/apiv2/mindme_aibase/resource_reference/{hostId}/inputs', name: 'apiv2_mindme_aibase_resource_reference_inputs_update', methods: ['PUT'])]
    public function update(string $hostId, Request $request): JsonResponse
    {
        $host = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $hostId]);

        if (!$host) {
            return new JsonResponse(['message' => 'Host resource not found'], 404);
        }

        $user = $this->tokenStorage->getToken()?->getUser();
        if (!$user instanceof User || !$this->authorization->isGranted('EDIT', $host)) {
            return new JsonResponse(['message' => 'Forbidden'], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return new JsonResponse(['message' => 'Invalid payload, expected an array of resource uuids'], 400);
        }

        foreach ($this->om->getRepository(ResourceReference::class)->findBy(['host' => $host]) as $existing) {
            $this->om->remove($existing);
        }
        $this->om->flush();

        $seen = [];
        $order = 0;
        foreach ($data as $targetId) {
            if (!is_string($targetId) || in_array($targetId, $seen, true)) {
                continue;
            }
            $target = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $targetId]);
            if (!$target) {
                continue;
            }

            $reference = new ResourceReference();
            $reference->setHost($host);
            $reference->setTarget($target);
            $reference->setOrder($order++);
            $seen[] = $targetId;
            $this->om->persist($reference);
        }
        $this->om->flush();

        return $this->list($hostId);
    }

    /**
     * Returns the CURRENT user's personal links for the host resource.
     */
    #[Route('/apiv2/mindme_aibase/resource_reference/{hostId}/inputs/mine', name: 'apiv2_mindme_aibase_resource_reference_inputs_mine', methods: ['GET'])]
    public function listMine(string $hostId): JsonResponse
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([]);
        }

        $host = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $hostId]);
        if (!$host) {
            return new JsonResponse(['message' => 'Host resource not found'], 404);
        }

        $userId = $user->getId();
        $references = $this->om->getRepository(ResourceReference::class)->findBy(
            ['host' => $host], ['order' => 'ASC']
        );

        $inputs = [];
        foreach ($references as $reference) {
            if ($reference->getUserId() !== $userId) {
                continue;
            }
            $target = $reference->getTarget();
            if ($target && !$this->authorization->isGranted('OPEN', $target)) {
                continue;
            }
            $inputs[] = $this->serializer->serialize($reference);
        }

        return new JsonResponse($inputs);
    }

    /**
     * Fully replaces the CURRENT user's personal links for the host resource.
     */
    #[Route('/apiv2/mindme_aibase/resource_reference/{hostId}/inputs/mine', name: 'apiv2_mindme_aibase_resource_reference_inputs_mine_update', methods: ['PUT'])]
    public function updateMine(string $hostId, Request $request): JsonResponse
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['message' => 'Forbidden'], 403);
        }

        $host = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $hostId]);
        if (!$host) {
            return new JsonResponse(['message' => 'Host resource not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return new JsonResponse(['message' => 'Invalid payload, expected an array of resource uuids'], 400);
        }

        $userId = $user->getId();
        foreach ($this->om->getRepository(ResourceReference::class)->findBy(['host' => $host]) as $existing) {
            if ($existing->getUserId() === $userId) {
                $this->om->remove($existing);
            }
        }
        $this->om->flush();

        $seen = [];
        $order = 0;
        foreach ($data as $targetId) {
            if (!is_string($targetId) || in_array($targetId, $seen, true)) {
                continue;
            }
            $target = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $targetId]);
            if (!$target) {
                continue;
            }
            if (!$this->authorization->isGranted('OPEN', $target)) {
                continue;
            }

            $reference = new ResourceReference();
            $reference->setHost($host);
            $reference->setUserId($userId);
            $reference->setTarget($target);
            $reference->setOrder($order++);
            $seen[] = $targetId;
            $this->om->persist($reference);
        }
        $this->om->flush();

        return $this->listMine($hostId);
    }
}