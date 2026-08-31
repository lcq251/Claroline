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

use Claroline\AppBundle\Persistence\ObjectManager as Pom;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Mindme\AibaseBundle\Entity\Aibase;
use Mindme\AibaseBundle\Entity\AibaseUsage;
use Mindme\AibaseBundle\Entity\Resource\ResourceReference;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Aibase context query & quota consume endpoints.
 *
 * Endpoints:
 *   GET  /apiv2/mindme_aibase/resource/{id}/aibase_context  – three-layer validation
 *   POST /apiv2/mindme_aibase/resource/{id}/aibase/consume   – increment lifetime quota
 *
 * NOTE: quota is the LIFETIME cumulative count (UNIQUE(userId, aibaseId)),
 * matching the AibaseUsage entity and the chat controller. The legacy source
 * queried a non-existent `period_date` daily column which would 500 — not ported.
 */
class AibaseContextController extends AbstractController
{
    public function __construct(
        private readonly Pom $om,
        private readonly AuthorizationCheckerInterface $authChecker,
    ) {
    }

    /**
     * GET /apiv2/mindme_aibase/resource/{id}/aibase_context
     *
     * Validates Open permission, expiry and lifetime quota.
     * Returns:
     *   { allowed: bool, reason?: string, aibase?: array{
     *       id: int, name: string, expiresAt: ?string,
     *       usageLimit: ?int, usageCount: int } }
     */
    #[Route('/apiv2/mindme_aibase/resource/{id}/aibase_context', name: 'apiv2_mindme_aibase_resource_aibase_context_get')]
    public function getAibaseContext(int $id): JsonResponse
    {
        /** @var ObjectRepository<ResourceNode> $nodeRepo */
        $nodeRepo = $this->om->getRepository(ResourceNode::class);
        $host = $nodeRepo->findOneBy(['id' => $id]);

        if (!$host) {
            return new JsonResponse([
                'allowed' => false,
                'reason'  => 'resource_not_found',
            ], Response::HTTP_NOT_FOUND);
        }

        // -- Layer 1: OPEN permission check ------------------------------------
        if (!$this->authChecker->isGranted('OPEN', $host)) {
            return new JsonResponse([
                'allowed' => false,
                'reason'  => 'no_permission',
            ], Response::HTTP_OK);
        }

        // -- Locate the linked Aibase via ResourceReference ---------------------
        /** @var ObjectRepository<ResourceReference> $refRepo */
        $refRepo = $this->om->getRepository(ResourceReference::class);
        $references = $refRepo->findBy(['host' => $host]);

        $aibase = null;
        foreach ($references as $ref) {
            $targetNode = $ref->getTarget();
            if ($targetNode instanceof ResourceNode) {
                $aibase = $this->om->getRepository(Aibase::class)->findOneBy(['resourceNode' => $targetNode]);
                if ($aibase) {
                    break;
                }
            }
        }

        if (!$aibase) {
            // host has no linked AI base resource
            return new JsonResponse([
                'allowed' => false,
                'reason'  => 'no_linked_aibase',
            ], Response::HTTP_OK);
        }

        // -- Layer 2: expiry check ---------------------------------------------
        if ($aibase->isExpired()) {
            return new JsonResponse([
                'allowed'    => false,
                'reason'     => 'expired',
                'aibase'     => $this->buildAibasePayload($aibase),
            ], Response::HTTP_OK);
        }

        // -- Layer 3: lifetime quota check -------------------------------------
        $userId = $this->getUser() ? $this->getUser()->getId() : 0;
        $usage = null;

        if ($aibase->getUsageLimit() !== null) {
            /** @var ObjectRepository<AibaseUsage> $usageRepo */
            $usageRepo = $this->om->getRepository(AibaseUsage::class);
            $usage = $usageRepo->findOneBy([
                'userId'    => $userId,
                'aibaseId'  => (int) $aibase->getId(),
            ]);

            if ($usage && $usage->getCount() >= $usage->getLimit()) {
                return new JsonResponse([
                    'allowed'    => false,
                    'reason'     => 'quota_exceeded',
                    'aibase'     => $this->buildAibasePayload($aibase),
                ], Response::HTTP_OK);
            }
        }

        // All three layers passed — return context payload ---------------------
        return new JsonResponse([
            'allowed'  => true,
            'aibase'   => $this->buildAibasePayload($aibase, $usage),
        ], Response::HTTP_OK);
    }

    /**
     * POST /apiv2/mindme_aibase/resource/{id}/aibase/consume
     *
     * Increments the lifetime usage count (quota consumption after the iframe loads).
     */
    #[Route('/apiv2/mindme_aibase/resource/{id}/aibase/consume', name: 'apiv2_mindme_aibase_resource_aibase_consume')]
    public function consumeAibaseUsage(int $id): JsonResponse
    {
        /** @var ResourceNode|null $host */
        $host = ($nodeRepo = $this->om->getRepository(ResourceNode::class))
            ->findOneBy(['id' => $id]);

        if (!$host) {
            return new JsonResponse([
                'consumed' => false,
                'reason'   => 'resource_not_found',
            ], Response::HTTP_NOT_FOUND);
        }

        // Re-validate all three layers before consuming -------------------------
        if (!$this->authChecker->isGranted('OPEN', $host)) {
            return new JsonResponse([
                'consumed' => false,
                'reason'   => 'no_permission',
            ], Response::HTTP_OK);
        }

        /** @var ObjectRepository<ResourceReference> $refRepo */
        $refRepo = $this->om->getRepository(ResourceReference::class);
        $references = $refRepo->findBy(['host' => $host]);

        $aibase = null;
        foreach ($references as $ref) {
            $targetNode = $ref->getTarget();
            if ($targetNode instanceof ResourceNode) {
                $aibase = $this->om->getRepository(Aibase::class)->findOneBy(['resourceNode' => $targetNode]);
                if ($aibase) {
                    break;
                }
            }
        }

        if (!$aibase) {
            return new JsonResponse([
                'consumed' => false,
                'reason'   => 'no_linked_aibase',
            ], Response::HTTP_OK);
        }

        if ($aibase->isExpired()) {
            return new JsonResponse([
                'consumed' => false,
                'reason'   => 'expired',
            ], Response::HTTP_OK);
        }

        $usageLimit = $aibase->getUsageLimit();
        if ($usageLimit === null) {
            // No explicit limit on this Aibase; skip quota tracking entirely.
            return new JsonResponse([
                'consumed' => false,
                'reason'   => 'no_usage_limit',
            ], Response::HTTP_OK);
        }

        $userId = $this->getUser() ? $this->getUser()->getId() : 0;

        /** @var ObjectRepository<AibaseUsage> $usageRepo */
        $usageRepo = $this->om->getRepository(AibaseUsage::class);
        $usage = $usageRepo->findOneBy([
            'userId'    => $userId,
            'aibaseId'  => (int) $aibase->getId(),
        ]);

        // Already at limit — don't consume
        if ($usage && $usage->getCount() >= $usage->getLimit()) {
            return new JsonResponse([
                'consumed' => false,
                'reason'   => 'quota_exceeded',
                'remaining'=> 0,
            ], Response::HTTP_OK);
        }

        // Increment (or insert a fresh row) ------------------------------------
        if (!$usage) {
            // Determine per-resource limit or platform default fallback.
            $limit = $aibase->getUsageLimit() ?? 20;
            $usage = new AibaseUsage();
            $usage->setUserId($userId);
            $usage->setAibaseId((int) $aibase->getId());
            $usage->setLimit($limit);
            $usage->setCount(0);
            $this->om->persist($usage);
        }

        $usage->setCount($usage->getCount() + 1);
        $this->om->flush();

        return new JsonResponse([
            'consumed' => true,
            'remaining'=> max(0, $usage->getLimit() - $usage->getCount()),
        ], Response::HTTP_OK);
    }

    /**
     * Build the aibase payload used by both endpoints.
     */
    private function buildAibasePayload(Aibase $aibase, ?AibaseUsage $usage = null): array
    {
        /** @var \DateTime|null $expiresAt */
        $expiresAt = $aibase->getExpiresAt();

        return [
            'id'         => $aibase->getId(),
            'uuid'       => $aibase->getResourceNode()?->getUuid(),
            'name'       => $aibase->getName(),
            'expiresAt'  => $expiresAt?->format(\DateTime::ATOM),
            'usageLimit' => $aibase->getUsageLimit(),
            'usageCount' => $usage ? $usage->getCount() : 0,
        ];
    }
}