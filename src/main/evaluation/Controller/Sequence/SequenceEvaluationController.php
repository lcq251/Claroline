<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\EvaluationBundle\Controller\Sequence;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Finder\FinderQuery;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Entity\Sequence\Step;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\EvaluationBundle\Entity\UserEvaluation\SequenceEvaluation;
use Claroline\EvaluationBundle\Manager\SequenceEvaluationManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Manages user evaluations for sequences {@see SequenceEvaluation}}.
 */
#[Route(path: '/sequence_evaluation')]
class SequenceEvaluationController
{
    use RequestDecoderTrait;
    use PermissionCheckerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly SerializerProvider $serializer,
        private readonly Crud $crud,
        private readonly SequenceEvaluationManager $evaluationManager
    ) {
        $this->authorization = $authorization;
    }

    /**
     * Returns the list of user evaluations for a ResourceNode.
     */
    #[Route(path: '/{sequenceId}', name: 'apiv2_sequence_evaluation_list', methods: ['GET'])]
    public function listAction(
        #[MapEntity(mapping: ['sequenceId' => 'uuid'])]
        Sequence $sequence,
        #[MapQueryString]
        ?FinderQuery $finderQuery = new FinderQuery()
    ): StreamedJsonResponse {
        if (!$this->authorization->isGranted('IS_AUTHENTICATED_FULLY')) {
            throw new AccessDeniedException();
        }

        $finderQuery->addFilter('sequence', $sequence->getUuid());
        if (!$this->checkPermission('EDIT', $sequence)) {
            // only display evaluation of the current user
            /** @var User $user */
            $user = $this->tokenStorage->getToken()?->getUser();
            $finderQuery->addFilter('user', $user->getUuid());
        }

        $evaluations = $this->crud->search(SequenceEvaluation::class, $finderQuery, [SerializerInterface::SERIALIZE_LIST]);

        return $evaluations->toResponse();
    }

    /**
     * Update step progression for a user.
     */
    #[Route(path: '/{id}', name: 'apiv2_sequence_evaluation_update', methods: ['PUT'])]
    public function updateProgressionAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Step $step,
        #[CurrentUser]
        ?User $user
    ): JsonResponse {
        if (null === $user) {
            return new JsonResponse(null, 204);
        }

        $sequence = $step->getSequence();

        $this->checkPermission('OPEN', $sequence, [], true);

        $stepProgression = $this->evaluationManager->update($step, $user);

        $userEvaluation = $this->evaluationManager->getUserEvaluation($sequence, $user, false);
        // get embedded resources evaluations
        $resourceEvaluations = $this->evaluationManager->getResourceEvaluations($sequence, $user);

        return new JsonResponse([
            'userEvaluation' => $this->serializer->serialize($userEvaluation, [SerializerInterface::SERIALIZE_MINIMAL]),
            'resourceEvaluations' => array_map(function (ResourceEvaluation $resourceEvaluation) {
                return $this->serializer->serialize($resourceEvaluation, [SerializerInterface::SERIALIZE_MINIMAL]);
            }, $resourceEvaluations),
            'userProgression' => [
                'stepId' => $step->getUuid(),
                'status' => $stepProgression->getStatus(),
            ],
        ]);
    }

    /**
     * Recalculates (score, status, progression, ...) evaluations for all the users of a sequence.
     */
    #[Route(path: '/{sequenceId}/recompute', name: 'apiv2_sequence_evaluation_recompute', methods: ['PUT'])]
    public function recomputeAction(
        #[MapEntity(mapping: ['sequenceId' => 'uuid'])]
        Sequence $sequence
    ): JsonResponse {
        $this->checkPermission('EDIT', $sequence, [], true);

        $this->evaluationManager->recomputeEvaluations($sequence);

        return new JsonResponse(null, 204);
    }

    /**
     * Removes all user evaluations for the sequence.
     */
    #[Route(path: '/{sequenceId}', name: 'apiv2_sequence_evaluation_purge', methods: ['DELETE'])]
    public function purgeAction(
        #[MapEntity(mapping: ['sequenceId' => 'uuid'])]
        Sequence $sequence
    ): JsonResponse {
        $this->checkPermission('ADMINISTRATE', $sequence, [], true);

        $this->evaluationManager->purgeEvaluations($sequence);

        return new JsonResponse(null, 204);
    }
}
