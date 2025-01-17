<?php

namespace Claroline\EvaluationBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\CoreBundle\Entity\Resource\ResourceUserEvaluation;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\EvaluationBundle\Library\EvaluationOptions;

class ResourceEvaluationSerializer
{
    public function __construct(
        private readonly ResourceNodeSerializer $resourceNodeSerializer,
        private readonly UserSerializer $userSerializer
    ) {
    }

    public function getName(): string
    {
        return 'resource_user_evaluation';
    }

    public function getClass(): string
    {
        return ResourceUserEvaluation::class;
    }

    public function serialize(ResourceUserEvaluation $resourceUserEvaluation, ?array $options = []): array
    {
        $score = $resourceUserEvaluation->getScore();
        if ($score) {
            $score = round($score, EvaluationOptions::SCORE_PRECISION);
        }

        $progression = $resourceUserEvaluation->getProgression();
        if ($progression) {
            $progression = round($progression, EvaluationOptions::PROGRESSION_PRECISION);
        }

        $serialized = [
            'id' => $resourceUserEvaluation->getId(),
            'date' => DateNormalizer::normalize($resourceUserEvaluation->getDate()),
            'status' => $resourceUserEvaluation->getStatus(),
            'duration' => $resourceUserEvaluation->getDuration(),
            'score' => $score,
            'scoreMin' => $resourceUserEvaluation->getScoreMin(),
            'scoreMax' => $resourceUserEvaluation->getScoreMax(),
            'progression' => $progression,
            'nbAttempts' => $resourceUserEvaluation->getNbAttempts(),
            'nbOpenings' => $resourceUserEvaluation->getNbOpenings(),
            'required' => $resourceUserEvaluation->isRequired(),
            'estimatedDuration' => $resourceUserEvaluation->getEstimatedDuration(),
        ];

        if (!in_array(SerializerInterface::SERIALIZE_MINIMAL, $options)) {
            $serialized['resourceNode'] = $this->resourceNodeSerializer->serialize($resourceUserEvaluation->getResourceNode(), [SerializerInterface::SERIALIZE_MINIMAL]);
            $serialized['user'] = $this->userSerializer->serialize($resourceUserEvaluation->getUser(), [SerializerInterface::SERIALIZE_MINIMAL]);
        }

        return $serialized;
    }
}
