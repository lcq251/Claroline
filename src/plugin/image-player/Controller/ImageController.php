<?php

namespace Claroline\ImagePlayerBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\ImagePlayerBundle\Entity\Image;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

#[Route(path: '/image')]
class ImageController
{
    use PermissionCheckerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly ObjectManager $om,
        private readonly FileManager $fileManager
    ) {
        $this->authorization = $authorization;
    }

    #[Route(path: '/{id}', name: 'apiv2_image_file', methods: ['GET'])]
    public function fileAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        ResourceNode $image
    ): BinaryFileResponse {
        $this->checkPermission('OPEN', $image, [], true);

        $imageFile = $this->om->getRepository(Image::class)->findOneBy([
            'resourceNode' => $image,
        ]);

        return new BinaryFileResponse($this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$imageFile->getUrl());
    }
}
