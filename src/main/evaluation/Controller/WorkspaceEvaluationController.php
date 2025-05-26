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
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\EvaluationBundle\Entity\UserEvaluation\WorkspaceEvaluation;
use Claroline\EvaluationBundle\Manager\WorkspaceEvaluationManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Manages user evaluations for workspaces {@see WorkspaceEvaluation}}.
 */
#[Route(path: '/evaluations/workspace')]
class WorkspaceEvaluationController
{
    use RequestDecoderTrait;
    use PermissionCheckerTrait;

    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authorization,
        private readonly ObjectManager $om,
        private readonly Crud $crud,
        private readonly FinderProvider $finder,
        private readonly SerializerProvider $serializer,
        private readonly WorkspaceEvaluationManager $manager
    ) {
        $this->authorization = $authorization;
    }

    #[Route(path: '/{workspace}', name: 'apiv2_workspace_evaluation_list', methods: ['GET'])]
    public function listAction(
        #[MapQueryString]
        ?FinderQuery $finderQuery = new FinderQuery(),
        #[MapEntity(mapping: ['workspace' => 'uuid'])]
        ?Workspace $workspace = null
    ): StreamedJsonResponse {
        $this->checkToolAccess('OPEN', $workspace);

        if ($workspace) {
            $finderQuery->addFilter('workspace', $workspace->getUuid());
        }

        $evaluations = $this->crud->search(WorkspaceEvaluation::class, $finderQuery, [SerializerInterface::SERIALIZE_LIST]);

        return $evaluations->toResponse();
    }

    #[Route(path: '/{workspace}/user/{user}', name: 'apiv2_workspace_evaluation_get', methods: ['GET'])]
    public function getAction(
        #[MapEntity(mapping: ['workspace' => 'uuid'])]
        Workspace $workspace,
        #[MapEntity(mapping: ['user' => 'uuid'])]
        User $user
    ): JsonResponse {
        $workspaceEvaluation = $this->om->getRepository(WorkspaceEvaluation::class)->findOneBy([
            'workspace' => $workspace,
            'user' => $user,
        ]);

        $this->checkPermission('OPEN', $workspaceEvaluation, [], true);

        return new JsonResponse(
            $this->serializer->serialize($workspaceEvaluation)
        );
    }

    #[Route(path: '/', name: 'apiv2_workspace_evaluation_delete', methods: ['DELETE'])]
    public function deleteAction(Request $request): JsonResponse
    {
        $evaluationIds = $this->decodeRequest($request);

        foreach ($evaluationIds as $evaluationId) {
            $evaluation = $this->om->getRepository(WorkspaceEvaluation::class)->findOneBy([
                'uuid' => $evaluationId,
            ]);

            $this->crud->delete($evaluation);
        }

        return new JsonResponse(null, 204);
    }

    /**
     * Initializes evaluations for all the users of a workspace.
     */
    #[Route(path: '/{workspace}/init', name: 'apiv2_workspace_evaluation_init', methods: ['PUT'])]
    public function initializeAction(
        #[MapEntity(mapping: ['workspace' => 'uuid'])]
        Workspace $workspace
    ): JsonResponse {
        $this->checkToolAccess('EDIT', $workspace);

        $this->manager->initialize($workspace);

        return new JsonResponse(null, 204);
    }

    #[Route(path: '/{workspace}/progression/{user}', name: 'apiv2_workspace_get_user_progression', methods: ['GET'])]
    public function getUserProgressionAction(
        #[MapEntity(mapping: ['workspace' => 'uuid'])]
        Workspace $workspace,
        #[MapEntity(mapping: ['user' => 'uuid'])]
        User $user
    ): JsonResponse {
        $workspaceEvaluation = $this->om->getRepository(WorkspaceEvaluation::class)->findOneBy([
            'workspace' => $workspace,
            'user' => $user,
        ]);

        if (empty($workspaceEvaluation)) {
            throw new NotFoundHttpException();
        }

        $this->checkPermission('OPEN', $workspaceEvaluation, [], true);

        return new JsonResponse([
            'workspaceEvaluation' => $this->serializer->serialize($workspaceEvaluation),
            'resourceEvaluations' => $this->finder->search(ResourceEvaluation::class, [
                'filters' => ['workspace' => $workspace->getUuid(), 'user' => $user->getUuid()],
            ])['data'],
        ]);
    }

    #[Route(path: '/{workspace}/requirements', name: 'apiv2_workspace_required_resource_list', methods: ['GET'])]
    public function listRequiredResourcesAction(
        #[MapEntity(mapping: ['workspace' => 'uuid'])]
        Workspace $workspace,
        Request $request
    ): JsonResponse {
        $this->checkToolAccess('OPEN', $workspace);

        return new JsonResponse(
            $this->finder->search(ResourceNode::class, array_merge($request->query->all(), ['hiddenFilters' => [
                'workspace' => $workspace->getUuid(),
                'required' => true,
            ]]), [Options::SERIALIZE_LIST])
        );
    }

    /**
     * Recalculates (score, status, progression, ...) evaluations for all the users of a workspace.
     */
    #[Route(path: '/{workspaceId}/recompute', name: 'apiv2_workspace_evaluation_recompute', methods: ['PUT'])]
    public function recomputeAction(
        #[MapEntity(mapping: ['workspaceId' => 'uuid'])]
        Workspace $workspace,
        Request $request
    ): JsonResponse {
        $evaluationIds = $this->decodeRequest($request);

        // recompute all the sequence evaluations
        if (empty($evaluationIds)) {
            $this->checkToolAccess('EDIT', $workspace);
            $this->manager->recomputeEvaluations($workspace);

            return new JsonResponse(null, 204);
        }

        // recompute selected evaluations
        foreach ($evaluationIds as $evaluationId) {
            $evaluation = $this->om->getRepository(WorkspaceEvaluation::class)->findOneBy([
                'uuid' => $evaluationId,
            ]);

            if ($evaluation && $this->checkPermission('ADMINISTRATE', $evaluation)) {
                $this->manager->refreshEvaluation($evaluation);
            }
        }

        return new JsonResponse(null, 204);
    }

    /**
     * Removes all user evaluations for the workspace.
     */
    #[Route(path: '/{workspaceId}', name: 'apiv2_workspace_evaluation_purge', methods: ['DELETE'])]
    public function purgeAction(
        #[MapEntity(mapping: ['workspaceId' => 'uuid'])]
        Workspace $workspace
    ): JsonResponse {
        $this->checkToolAccess('ADMINISTRATE', $workspace);

        $this->manager->purgeEvaluations($workspace);

        return new JsonResponse(null, 204);
    }

    /**
     * Checks user rights to access evaluation tool.
     */
    private function checkToolAccess(string $permission, Workspace $workspace = null, bool $exception = true): bool
    {
        if (!empty($workspace)) {
            $evaluationTool = $this->om->getRepository(OrderedTool::class)->findOneByNameAndContext('evaluation', WorkspaceContext::getName(), $workspace->getUuid());
        } else {
            $evaluationTool = $this->om->getRepository(OrderedTool::class)->findOneByNameAndContext('evaluation', DesktopContext::getName());
        }

        return $this->checkPermission($permission, $evaluationTool, [], $exception);
    }
}
