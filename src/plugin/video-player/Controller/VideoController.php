<?php

namespace Claroline\VideoPlayerBundle\Controller;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\VideoPlayerBundle\Entity\Video;
use Claroline\VideoPlayerBundle\Manager\EvaluationManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route(path: '/video')]
class VideoController
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

    #[Route(path: '/{id}', name: 'apiv2_video_file', methods: ['GET'])]
    public function fileAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $video
    ): BinaryFileResponse {
        $this->checkPermission('OPEN', $video, [], true);

        $videoFile = $this->om->getRepository(Video::class)->findOneBy([
            'resourceNode' => $video,
        ]);

        return new BinaryFileResponse($this->fileManager->getAbsolutePath($videoFile->getUrl()));
    }

    #[Route(path: '/{id}/progression/{currentTime}/{totalTime}', name: 'apiv2_video_progression_update', methods: ['PUT'])]
    public function updateProgressionAction(
        #[CurrentUser] ?User $user,
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $video,
        float $currentTime,
        float $totalTime
    ): JsonResponse {
        if (null === $user) {
            return new JsonResponse(null, 204);
        }

        $this->checkPermission('OPEN', $video, [], true);

        $this->evaluationManager->update($video, $user, $currentTime, $totalTime);

        $resourceUserEvaluation = $this->evaluationManager->getResourceUserEvaluation($video, $user);

        return new JsonResponse([
            'userEvaluation' => $this->serializer->serialize($resourceUserEvaluation, [SerializerInterface::SERIALIZE_MINIMAL]),
        ]);
    }
}
