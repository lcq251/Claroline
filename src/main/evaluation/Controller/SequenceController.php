<?php

namespace Claroline\EvaluationBundle\Controller;

use Claroline\AppBundle\API\Finder\FinderQuery;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CoreBundle\Entity\Resource\ResourceUserEvaluation;
use Claroline\CoreBundle\Entity\User;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Manager\SequenceEvaluationManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[Route(path: '/sequence', name: 'apiv2_evaluation_sequence_')]
class SequenceController extends AbstractCrudController
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly SequenceEvaluationManager $evaluationManager
    ) {
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

            $resourceEvaluations = array_map(function (ResourceUserEvaluation $resourceEvaluation) {
                return $this->serializer->serialize($resourceEvaluation);
            }, $this->evaluationManager->getRequiredEvaluations($sequence, $user));

            $stepsProgression = $this->evaluationManager->getStepsProgressionForUser($sequence, $user);
        }

        return new JsonResponse([
            'sequence' => $this->serializer->serialize($sequence),
            'userEvaluation' => $evaluation,
            'resourceEvaluations' => $resourceEvaluations,
            'stepsProgression' => $stepsProgression,
        ]);
    }
}
