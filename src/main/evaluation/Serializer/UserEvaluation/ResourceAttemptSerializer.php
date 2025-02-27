<?php

namespace Claroline\EvaluationBundle\Serializer\UserEvaluation;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceAttempt;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\EvaluationBundle\Library\EvaluationOptions;

class ResourceAttemptSerializer
{
    public function __construct(
        private readonly ResourceNodeSerializer $resourceNodeSerializer,
        private readonly UserSerializer $userSerializer
    ) {
    }

    public function getName(): string
    {
        return 'resource_evaluation';
    }

    public function getClass(): string
    {
        return ResourceAttempt::class;
    }

    public function serialize(ResourceAttempt $resourceEvaluation, array $options = []): array
    {
        $score = $resourceEvaluation->getScore();
        if ($score) {
            $score = round($score, EvaluationOptions::SCORE_PRECISION);
        }

        $progression = $resourceEvaluation->getProgression();
        if ($progression) {
            $progression = round($progression, EvaluationOptions::PROGRESSION_PRECISION);
        }

        $serialized = [
            'id' => $resourceEvaluation->getUuid(),
            'date' => DateNormalizer::normalize($resourceEvaluation->getLastActivityAt()),
            'lastActivityAt' => DateNormalizer::normalize($resourceEvaluation->getLastActivityAt()),
            'startedAt' => DateNormalizer::normalize($resourceEvaluation->getStartedAt()),
            'endedAt' => DateNormalizer::normalize($resourceEvaluation->getEndedAt()),
            'status' => $resourceEvaluation->getStatus(),
            'duration' => $resourceEvaluation->getDuration(),
            'score' => $score,
            'scoreMin' => $resourceEvaluation->getScoreMin(),
            'scoreMax' => $resourceEvaluation->getScoreMax(),
            'progression' => $progression,
        ];

        if (!in_array(SerializerInterface::SERIALIZE_MINIMAL, $options)) {
            $resourceUserEvaluation = $resourceEvaluation->getResourceUserEvaluation();

            $serialized = array_merge($serialized, [
                'comment' => $resourceEvaluation->getComment(),
                'data' => $resourceEvaluation->getData(),

                // used by data source, this may require another option to avoid getting it where we don't want it
                'resourceNode' => $this->resourceNodeSerializer->serialize($resourceUserEvaluation->getResourceNode(), [SerializerInterface::SERIALIZE_MINIMAL]),
                'user' => $this->userSerializer->serialize($resourceUserEvaluation->getUser(), [SerializerInterface::SERIALIZE_MINIMAL]),
            ]);
        }

        return $serialized;
    }
}
