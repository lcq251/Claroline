<?php

namespace Claroline\EvaluationBundle\Controller\Sequence;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Finder\FinderQuery;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\EvaluationBundle\Manager\SequenceEvaluationManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

#[Route(path: '/sequence', name: 'apiv2_evaluation_sequence_')]
class SequenceController extends AbstractCrudController
{
    use RequestDecoderTrait;
    use PermissionCheckerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly SequenceEvaluationManager $evaluationManager
    ) {
        $this->authorization = $authorization;
    }

    public static function getName(): string
    {
        return 'evaluation_sequence';
    }

    public static function getClass(): string
    {
        return Sequence::class;
    }

    #[Route(path: '/context/{context}/{contextId}', name: 'context_list', defaults: ['contextId' => null], methods: ['GET'])]
    public function listByContextAction(
        string $context,
        string $contextId = null,
        #[MapQueryString]
        ?FinderQuery $finderQuery = new FinderQuery()
    ): StreamedJsonResponse {
        if (WorkspaceContext::getName() === $context) {
            $finderQuery->addFilter('workspace', $contextId);
        }

        $teams = $this->crud->search(Sequence::class, $finderQuery, [SerializerInterface::SERIALIZE_LIST]);

        return $teams->toResponse();
    }

    #[Route(path: '/{id}', name: 'open', methods: ['GET'])]
    public function openAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Sequence $sequence
    ): JsonResponse {
        $this->checkPermission('OPEN', $sequence, [], true);

        $user = $this->tokenStorage->getToken()?->getUser();

        $evaluation = null;
        $resourceEvaluations = [];
        $stepsProgression = [];
        if ($user instanceof User) {
            // retrieve user progression
            $evaluation = $this->serializer->serialize(
                $this->evaluationManager->getUserEvaluation($sequence, $user),
                [SerializerInterface::SERIALIZE_MINIMAL]
            );

            $resourceEvaluations = array_map(function (ResourceEvaluation $resourceEvaluation) {
                return $this->serializer->serialize($resourceEvaluation, [SerializerInterface::SERIALIZE_MINIMAL]);
            }, $this->evaluationManager->getResourceEvaluations($sequence, $user));

            $stepsProgression = $this->evaluationManager->getStepsProgressionForUser($sequence, $user);
        }

        return new JsonResponse([
            'sequence' => $this->serializer->serialize($sequence),
            'userEvaluation' => $evaluation,
            'resourceEvaluations' => $resourceEvaluations,
            'stepsProgression' => $stepsProgression,
        ]);
    }

    #[Route(path: '/publish', name: 'publish', methods: ['PUT'])]
    public function publishAction(
        Request $request
    ): JsonResponse {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $data = $this->decodeRequest($request);

        $processed = [];

        $sequences = $this->om->getRepository(Sequence::class)->findBy(['uuid' => $data]);
        foreach ($sequences as $sequence) {
            if ($this->authorization->isGranted('EDIT', $sequence)) {
                $this->crud->update($sequence, [
                    'id' => $sequence->getUuid(),
                    'meta' => ['published' => true],
                ], [Crud::NO_PERMISSIONS, Crud::NO_VALIDATION]);
            }
        }

        return new JsonResponse(array_map(function (Sequence $sequence) {
            return $this->serializer->serialize($sequence);
        }, $processed));
    }

    #[Route(path: '/unpublish', name: 'unpublish', methods: ['PUT'])]
    public function unpublishAction(
        Request $request
    ): JsonResponse {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $data = $this->decodeRequest($request);

        $processed = [];

        $sequences = $this->om->getRepository(Sequence::class)->findBy(['uuid' => $data]);
        foreach ($sequences as $sequence) {
            if ($this->authorization->isGranted('EDIT', $sequence)) {
                $this->crud->update($sequence, [
                    'id' => $sequence->getUuid(),
                    'meta' => ['published' => false],
                ], [Crud::NO_PERMISSIONS, Crud::NO_VALIDATION]);
            }
        }

        return new JsonResponse(array_map(function (Sequence $sequence) {
            return $this->serializer->serialize($sequence);
        }, $processed));
    }
}
