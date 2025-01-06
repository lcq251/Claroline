<?php

namespace Claroline\EvaluationBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\EvaluationBundle\Entity\SequenceEvaluation;
use Claroline\EvaluationBundle\Serializer\Sequence\SequenceSerializer;

class SequenceEvaluationSerializer
{
    public function __construct(
        private readonly SequenceSerializer $sequenceSerializer,
        private readonly UserSerializer $userSerializer
    ) {
    }

    public function getName(): string
    {
        return 'resource_user_evaluation';
    }

    public function getClass(): string
    {
        return SequenceEvaluation::class;
    }

    public function serialize(SequenceEvaluation $sequenceEvaluation, ?array $options = []): array
    {
        $score = $sequenceEvaluation->getScore();
        if ($score) {
            $score = round($score, 2);
        }

        $serialized = [
            'id' => $sequenceEvaluation->getId(),
            'date' => DateNormalizer::normalize($sequenceEvaluation->getDate()),
            'status' => $sequenceEvaluation->getStatus(),
            'duration' => $sequenceEvaluation->getDuration(),
            'score' => $score,
            'scoreMin' => $sequenceEvaluation->getScoreMin(),
            'scoreMax' => $sequenceEvaluation->getScoreMax(),
            'progression' => $sequenceEvaluation->getProgression(),
            'required' => $sequenceEvaluation->isRequired(),
            'estimatedDuration' => $sequenceEvaluation->getEstimatedDuration(),
        ];

        if (!in_array(SerializerInterface::SERIALIZE_MINIMAL, $options)) {
            $serialized['resourceNode'] = $this->sequenceSerializer->serialize($sequenceEvaluation->getSequence(), [SerializerInterface::SERIALIZE_MINIMAL]);
            $serialized['user'] = $this->userSerializer->serialize($sequenceEvaluation->getUser(), [SerializerInterface::SERIALIZE_MINIMAL]);
        }

        return $serialized;
    }
}
