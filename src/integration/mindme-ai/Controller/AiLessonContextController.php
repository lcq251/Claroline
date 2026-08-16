<?php

namespace Claroline\MindMeAiBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager as Pom;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Entity\AiLessonUsage;
use Claroline\MindMeAiBundle\Entity\Resource\ResourceReference;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * AiLesson context query & quota consume endpoints.
 *
 * Endpoints:
 *   GET  /apiv2/mindme_ai/resource/{id}/ai_lesson_context  – three-layer validation
 *   POST /apiv2/mindme_ai/resource/{id}/ai_lesson/consume  – decrement daily quota
 */
class AiLessonContextController extends AbstractController
{
    public function __construct(
        private readonly Pom $om,
        private readonly AuthorizationCheckerInterface $authChecker,
    ) {}

    /**
     * GET /apiv2/mindme_ai/resource/{id}/ai_lesson_context
     *
     * Validates Open permission, expiry and daily quota.
     * Returns:
     *   { allowed: bool, reason?: string, aiLesson?: array{
     *       id: int, name: string, expiresAt: ?string,
     *       usageLimit: ?int, usageCount: int } }
     */
    #[Route('/apiv2/mindme_ai/resource/{id}/ai_lesson_context', name: 'apiv2_mindme_ai_resource_ai_lesson_context_get')]
    public function getAiLessonContext(int $id): JsonResponse
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

        // -- Locate the linked AiLesson via ResourceReference -------------------
        /** @var ObjectRepository<ResourceReference> $refRepo */
        $refRepo = $this->om->getRepository(ResourceReference::class);
        $references = $refRepo->findBy(['host' => $host]);

        $aiLesson = null;
        foreach ($references as $ref) {
            $targetNode = $ref->getTarget();
            if ($targetNode instanceof AiLesson) {
                $aiLesson = $targetNode;
                break;
            }
        }

        if (!$aiLesson) {
            // host has no linked AI lesson
            return new JsonResponse([
                'allowed' => false,
                'reason'  => 'no_linked_lesson',
            ], Response::HTTP_OK);
        }

        // -- Layer 2: expiry check ---------------------------------------------
        if ($aiLesson->isExpired()) {
            return new JsonResponse([
                'allowed'    => false,
                'reason'     => 'expired',
                'aiLesson'   => $this->buildAiLessonPayload($aiLesson),
            ], Response::HTTP_OK);
        }

        // -- Layer 3: daily quota check ----------------------------------------
        $userId = $this->getUser() ? $this->getUser()->getId() : 0;
        $today  = (new \DateTimeImmutable())->format('Y-m-d');
        $usage = null;

        if ($aiLesson->getUsageLimit() !== null) {
            /** @var ObjectRepository<AiLessonUsage> $usageRepo */
            $usageRepo = $this->om->getRepository(AiLessonUsage::class);
            $usage = $usageRepo->findOneBy([
                'userId'    => $userId,
                'aiLessonId'=> (int) $aiLesson->getId(),
                'periodDate'=> new \DateTime($today),
            ]);

            if ($usage && $usage->getCount() >= $usage->getLimit()) {
                return new JsonResponse([
                    'allowed'    => false,
                    'reason'     => 'quota_exceeded',
                    'aiLesson'   => $this->buildAiLessonPayload($aiLesson),
                ], Response::HTTP_OK);
            }
        }

        // All three layers passed — return context payload ---------------------
        return new JsonResponse([
            'allowed'  => true,
            'aiLesson' => $this->buildAiLessonPayload($aiLesson, $usage),
        ], Response::HTTP_OK);
    }

    /**
     * POST /apiv2/mindme_ai/resource/{id}/ai_lesson/consume
     *
     * Increments the daily usage count (quota consumption after the iframe loads).
     */
    #[Route('/apiv2/mindme_ai/resource/{id}/ai_lesson/consume', name: 'apiv2_mindme_ai_resource_ai_lesson_consume')]
    public function consumeAiLessonUsage(int $id, Request $request): JsonResponse
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

        $aiLesson = null;
        foreach ($references as $ref) {
            $targetNode = $ref->getTarget();
            if ($targetNode instanceof AiLesson) {
                $aiLesson = $targetNode;
                break;
            }
        }

        if (!$aiLesson) {
            return new JsonResponse([
                'consumed' => false,
                'reason'   => 'no_linked_lesson',
            ], Response::HTTP_OK);
        }

        if ($aiLesson->isExpired()) {
            return new JsonResponse([
                'consumed' => false,
                'reason'   => 'expired',
            ], Response::HTTP_OK);
        }

        $usageLimit = $aiLesson->getUsageLimit();
        if ($usageLimit === null) {
            // No explicit limit on this AiLesson; skip quota tracking entirely.
            return new JsonResponse([
                'consumed' => false,
                'reason'   => 'no_usage_limit',
            ], Response::HTTP_OK);
        }

        $userId = $this->getUser() ? $this->getUser()->getId() : 0;
        $today  = new \DateTimeImmutable();
        $periodDate = (clone $today)->format('Y-m-d');

        /** @var ObjectRepository<AiLessonUsage> $usageRepo */
        $usageRepo = $this->om->getRepository(AiLessonUsage::class);
        $usage = $usageRepo->findOneBy([
            'userId'    => $userId,
            'aiLessonId'=> (int) $aiLesson->getId(),
            'periodDate'=> new \DateTime($periodDate),
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
            // The usageLimit column is a snapshot; use that.
            $limit = $aiLesson->getUsageLimit() ?? 20;
            $usage = new AiLessonUsage();
            $usage->setUserId($userId);
            $usage->setAiLessonId((int) $aiLesson->getId());
            $usage->setPeriodDate(new \DateTime($periodDate));
            $usage->setLimit($limit);
            $usage->setCount(0);
        }

        ++$usage->getCount();
        $this->om->flush();

        return new JsonResponse([
            'consumed' => true,
            'remaining'=> max(0, $usage->getLimit() - $usage->getCount()),
        ], Response::HTTP_OK);
    }

    /**
     * Build the aiLesson payload used by both endpoints.
     */
    private function buildAiLessonPayload(AiLesson $aiLesson, ?AiLessonUsage $usage = null): array
    {
        /** @var \DateTime|null $expiresAt */
        $expiresAt       = $aiLesson->getExpiresAt();
        $usageCount      = ($usage && $usage->getPeriodDate()
            && $usage->getPeriodDate()->format('Y-m-d') === (new \DateTimeImmutable())->format('Y-m-d'))
            ? $usage->getCount() : 0;

        return [
            'id'         => $aiLesson->getId(),
            'name'       => $aiLesson->getName(),
            'expiresAt'  => $expiresAt?->format(\DateTime::ATOM),
            'usageLimit' => $aiLesson->getUsageLimit(),
            'usageCount' => $usageCount,
        ];
    }
}
