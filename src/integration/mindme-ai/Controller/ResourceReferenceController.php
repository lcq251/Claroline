<?php

namespace Claroline\MindMeAiBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\MindMeAiBundle\Entity\Resource\ResourceReference;
use Claroline\MindMeAiBundle\Serializer\ResourceReferenceSerializer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Generic "resource as input of another resource" API (route C).
 *
 * GET  - list the host's inputs, ordered by `entity_order`, each target
 *        checked against the current user's OPEN permission (D5: a target
 *        the user cannot OPEN is filtered out; a dangling reference —
 *        target deleted — is still returned so the frontend can display
 *        "resource deleted").
 * PUT  - full replacement of the input list. body = [targetUuid, ...],
 *        array order becomes the new entity_order. Unknown uuids are
 *        skipped, duplicates are dropped.
 */
class ResourceReferenceController
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly ResourceReferenceSerializer $serializer,
        private readonly AuthorizationCheckerInterface $authorization
    ) {
    }

    /**
     * Returns the host resource's inputs (ordered, per-target OPEN check).
     */
    #[Route('/apiv2/mindme_ai/resource_reference/{hostId}/inputs', name: 'apiv2_mindme_ai_resource_reference_inputs', methods: ['GET'])]
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
            $target = $reference->getTarget();
            // Target deleted -> dangling reference is still returned (frontend shows "resource deleted").
            // Target exists but the current user has no OPEN right -> filtered out (D5).
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
    #[Route('/apiv2/mindme_ai/resource_reference/{hostId}/inputs', name: 'apiv2_mindme_ai_resource_reference_inputs_update', methods: ['PUT'])]
    public function update(string $hostId, Request $request): JsonResponse
    {
        $host = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $hostId]);

        if (!$host) {
            return new JsonResponse(['message' => 'Host resource not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return new JsonResponse(['message' => 'Invalid payload, expected an array of resource uuids'], 400);
        }

        // delete old references (full replacement semantics)
        foreach ($this->om->getRepository(ResourceReference::class)->findBy(['host' => $host]) as $existing) {
            $this->om->remove($existing);
        }
        $this->om->flush();

        // insert new references (deduplicated, array order = entity_order)
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
}
