<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CommunityBundle\Controller;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\AppBundle\Manager\File\TempFileManager;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Normalizer\TextNormalizer;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route(path: '/profile')]
class ProfileController
{
    use PermissionCheckerTrait;
    use RequestDecoderTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly ObjectManager $om,
        private readonly TempFileManager $tempManager,
        private readonly Crud $crud,
        private readonly SerializerProvider $serializer,
        private readonly ParametersSerializer $parametersSerializer
    ) {
        $this->authorization = $authorization;
    }

    public function getName(): string
    {
        return 'profile';
    }

    #[Route(path: '/export', name: 'apiv2_profile_export', methods: ['GET'])]
    public function exportAction(#[CurrentUser] User $user): BinaryFileResponse
    {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $pathArch = $this->tempManager->generate();

        $archive = new \ZipArchive();
        $archive->open($pathArch, \ZipArchive::CREATE);

        // add user json
        $archive->addFromString('user.json', json_encode($this->serializer->serialize($user), JSON_PRETTY_PRINT));

        $archive->close();

        $fileName = TextNormalizer::toKey($user->getUsername()).'.zip';

        return new BinaryFileResponse($pathArch, 200, [
            'Content-Disposition' => "attachment; filename={$fileName}",
        ]);
    }

    #[Route(path: '/status/{status}', name: 'apiv2_user_change_status', methods: ['PUT'])]
    public function changeStatusAction(#[CurrentUser] ?User $user, string $status): JsonResponse
    {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        if ('online' === $status) {
            $status = null;
        }
        $user->setStatus($status);

        $this->om->persist($user);
        $this->om->flush();

        return new JsonResponse($user->getStatus());
    }
}
