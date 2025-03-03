<?php

namespace Claroline\AudioPlayerBundle\Controller;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AudioPlayerBundle\Entity\Resource\Audio;
use Claroline\AudioPlayerBundle\Manager\EvaluationManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route(path: '/audio')]
class AudioController
{
    use PermissionCheckerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer,
        private readonly FileManager $fileManager,
        private readonly EvaluationManager $evaluationManager
    ) {
        $this->authorization = $authorization;
    }

    #[Route(path: '/{id}', name: 'apiv2_audio_file', methods: ['GET'])]
    public function fileAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $audio
    ): BinaryFileResponse {
        $this->checkPermission('OPEN', $audio, [], true);

        $audioFile = $this->om->getRepository(Audio::class)->findOneBy([
            'resourceNode' => $audio,
        ]);

        return new BinaryFileResponse($this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$audioFile->getUrl());
    }

    #[Route(path: '/{id}/progression/{currentTime}/{totalTime}', name: 'apiv2_audio_progression_update', methods: ['PUT'])]
    public function updateProgressionAction(
        #[CurrentUser] ?User $user,
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $audio,
        float $currentTime,
        float $totalTime
    ): JsonResponse {
        if (null === $user) {
            return new JsonResponse(null, 204);
        }

        $this->checkPermission('OPEN', $audio, [], true);

        $this->evaluationManager->update($audio, $user, $currentTime, $totalTime);

        $resourceUserEvaluation = $this->evaluationManager->getResourceUserEvaluation($audio, $user);

        return new JsonResponse([
            'userEvaluation' => $this->serializer->serialize($resourceUserEvaluation, [SerializerInterface::SERIALIZE_MINIMAL]),
        ]);
    }
}
