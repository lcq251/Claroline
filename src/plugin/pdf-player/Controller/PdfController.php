<?php

namespace Claroline\PdfPlayerBundle\Controller;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\PdfPlayerBundle\Entity\Pdf;
use Claroline\PdfPlayerBundle\Manager\EvaluationManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route(path: '/pdf')]
class PdfController
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

    #[Route(path: '/{id}', name: 'apiv2_pdf_file', methods: ['GET'])]
    public function fileAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $video
    ): BinaryFileResponse {
        $this->checkPermission('OPEN', $video, [], true);

        $videoFile = $this->om->getRepository(Pdf::class)->findOneBy([
            'resourceNode' => $video,
        ]);

        return new BinaryFileResponse($this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$videoFile->getUrl());
    }

    #[Route(path: '/{id}/progression/{page}/{total}', name: 'apiv2_pdf_progression_update', methods: ['PUT'])]
    public function updateProgressionAction(
        #[CurrentUser]
        ?User $user,
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $pdf,
        int $page,
        int $total
    ): JsonResponse {
        if (null === $user) {
            return new JsonResponse(null, 204);
        }

        $this->checkPermission('OPEN', $pdf, [], true);

        $this->evaluationManager->update($pdf, $user, $page, $total);

        $resourceUserEvaluation = $this->evaluationManager->getResourceUserEvaluation($pdf, $user);

        return new JsonResponse([
            'userEvaluation' => $this->serializer->serialize($resourceUserEvaluation, [Options::SERIALIZE_MINIMAL]),
        ]);
    }
}
