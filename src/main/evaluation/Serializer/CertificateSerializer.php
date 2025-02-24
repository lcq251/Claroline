<?php

namespace Claroline\EvaluationBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\EvaluationBundle\Entity\Certificate;
use Claroline\EvaluationBundle\Serializer\UserEvaluation\WorkspaceEvaluationSerializer;

class CertificateSerializer
{
    public function __construct(
        private readonly UserSerializer $userSerializer,
        private readonly WorkspaceEvaluationSerializer $workspaceEvaluationSerializer
    ) {
    }

    public function getName(): string
    {
        return 'certificate';
    }

    public function getClass(): string
    {
        return Certificate::class;
    }

    public function serialize(Certificate $certificate, ?array $options = []): array
    {
        $serialized = [
            'id' => $certificate->getUuid(),
            'obtentionDate' => DateNormalizer::normalize($certificate->getObtentionDate()),
            'issueDate' => DateNormalizer::normalize($certificate->getIssueDate()),
            'content' => $certificate->getContent(),
            'status' => $certificate->getStatus(),
            'score' => $certificate->getScore(),
            'language' => $certificate->getLanguage(),
        ];

        if (!in_array(SerializerInterface::SERIALIZE_MINIMAL, $options)) {
            $serialized['user'] = $this->userSerializer->serialize($certificate->getUser(), [SerializerInterface::SERIALIZE_MINIMAL]);
            $serialized['evaluation'] = $this->workspaceEvaluationSerializer->serialize($certificate->getEvaluation(), [SerializerInterface::SERIALIZE_MINIMAL]);
        }

        return $serialized;
    }
}
