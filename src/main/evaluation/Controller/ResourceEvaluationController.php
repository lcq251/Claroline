<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\EvaluationBundle\Controller;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Finder\FinderQuery;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceAttempt;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\EvaluationBundle\Manager\ResourceEvaluationManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Manages user evaluations for resources {@see ResourceUserEvaluation}}.
 */
#[Route(path: '/resource_evaluation')]
class ResourceEvaluationController
{
    use PermissionCheckerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly SerializerProvider $serializer,
        private readonly FinderProvider $finder,
        private readonly ResourceEvaluationManager $evaluationManager,
        private readonly Crud $crud
    ) {
        $this->authorization = $authorization;
    }

    /**
     * Returns the list of user evaluations for a ResourceNode.
     */
    #[Route(path: '/{nodeId}', name: 'apiv2_resource_evaluation_list', methods: ['GET'])]
    public function listAction(
        #[MapEntity(mapping: ['nodeId' => 'uuid'])]
        ResourceNode $resourceNode,
        #[MapQueryString]
        ?FinderQuery $finderQuery = new FinderQuery()
    ): StreamedJsonResponse {
        if (!$this->authorization->isGranted('IS_AUTHENTICATED_FULLY')) {
            throw new AccessDeniedException();
        }

        $finderQuery->addFilter('resourceNode', $resourceNode->getUuid());
        if (!$this->checkPermission('EDIT', $resourceNode)) {
            // only display evaluation of the current user
            /** @var User $user */
            $user = $this->tokenStorage->getToken()?->getUser();
            $finderQuery->addFilter('user', $user->getUuid());
        }

        $evaluations = $this->crud->search(ResourceEvaluation::class, $finderQuery, [SerializerInterface::SERIALIZE_LIST]);

        return $evaluations->toResponse();
    }

    #[Route(path: '/attempts/{userEvaluationId}', name: 'apiv2_resource_evaluation_list_attempts', methods: ['GET'])]
    public function listAttemptsAction(
        #[MapEntity(mapping: ['userEvaluationId' => 'id'])]
        ResourceEvaluation $userEvaluation,
        Request $request
    ): JsonResponse {
        $this->checkPermission('OPEN', $userEvaluation, [], true);

        return new JsonResponse(
            $this->finder->search(ResourceAttempt::class, array_merge($request->query->all(), ['hiddenFilters' => [
                'resourceUserEvaluation' => $userEvaluation,
            ]]))
        );
    }

    #[Route(path: '/attempts/{userEvaluationId}', name: 'apiv2_resource_evaluation_give_attempt', methods: ['PUT'])]
    public function giveAnotherAttemptAction(
        #[MapEntity(mapping: ['userEvaluationId' => 'id'])]
        ResourceEvaluation $userEvaluation
    ): JsonResponse {
        $this->checkPermission('ADMINISTRATE', $userEvaluation, [], true);

        $this->evaluationManager->giveAnotherAttempt($userEvaluation);

        return new JsonResponse(
            $this->serializer->serialize($userEvaluation)
        );
    }

    /**
     * Recalculates (score, status, progression, ...) evaluations for all the users of a resource.
     */
    #[Route(path: '/{resourceId}/recompute', name: 'apiv2_resource_evaluation_recompute', methods: ['PUT'])]
    public function recomputeAction(
        #[MapEntity(mapping: ['resourceId' => 'uuid'])]
        ResourceNode $resourceNode
    ): JsonResponse {
        $this->checkPermission('EDIT', $resourceNode, [], true);

        $this->evaluationManager->recomputeEvaluations($resourceNode);

        return new JsonResponse(null, 204);
    }

    /**
     * Removes all user evaluations for the sequence.
     */
    #[Route(path: '/{resourceId}', name: 'apiv2_resource_evaluation_purge', methods: ['DELETE'])]
    public function purgeAction(
        #[MapEntity(mapping: ['resourceId' => 'uuid'])]
        ResourceNode $resourceNode
    ): JsonResponse {
        $this->checkPermission('ADMINISTRATE', $resourceNode, [], true);

        $this->evaluationManager->purgeEvaluations($resourceNode);

        return new JsonResponse(null, 204);
    }
}
