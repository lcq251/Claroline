<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\PdfPlayerBundle\Component\Resource;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Resource\DownloadableResourceInterface;
use Claroline\CoreBundle\Component\Resource\FileAdapterInterface;
use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use Claroline\EvaluationBundle\Component\Resource\EvaluatedResourceInterface;
use Claroline\PdfPlayerBundle\Entity\Pdf;
use Claroline\PdfPlayerBundle\Manager\EvaluationManager;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Integrates PDF files into Claroline.
 */
class PdfResource extends ResourceComponent implements DownloadableResourceInterface, EvaluatedResourceInterface, FileAdapterInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly SerializerProvider $serializer,
        private readonly FileManager $fileManager,
        private readonly ObjectManager $om,
        private readonly EvaluationManager $evaluationManager
    ) {
    }

    public static function getName(): string
    {
        return 'pdf';
    }

    /** @param Pdf $resource */
    public function open(AbstractResource $resource, bool $embedded = false): ?array
    {
        $user = $this->tokenStorage->getToken()?->getUser();

        return [
            'userEvaluation' => $user instanceof User ? $this->serializer->serialize(
                $this->evaluationManager->getResourceUserEvaluation($resource->getResourceNode(), $user),
                [SerializerInterface::SERIALIZE_MINIMAL]
            ) : null,
        ];
    }

    /** @param Pdf $resource */
    public function create(AbstractResource $resource, array $data): void
    {
        $filesystem = new Filesystem();

        try {
            $file = new File($resource->getUrl());
        } catch (FileNotFoundException $e) {
            throw new InvalidDataException('Cannot find the file for video resource.');
        }

        $resourceNode = $resource->getResourceNode();
        $workspace = $resourceNode->getWorkspace();
        $workspaceDir = 'WORKSPACE_'.$workspace->getId();

        if (!$filesystem->exists($this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$workspaceDir.DIRECTORY_SEPARATOR.'pdf')) {
            $filesystem->mkdir($this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$workspaceDir.DIRECTORY_SEPARATOR.'pdf');
        }

        $finalPath = $workspaceDir.DIRECTORY_SEPARATOR.'pdf'.DIRECTORY_SEPARATOR.$resourceNode->getUuid().'.'.$file->guessExtension();
        $filesystem->rename($resource->getUrl(), $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$finalPath);

        $resource->setUrl($finalPath);
        $this->om->persist($resource);
        $this->om->flush();
    }

    /** @param Pdf $resource */
    public function download(AbstractResource $resource): ?string
    {
        return $resource->getUrl();
    }

    /** @param Pdf $resource */
    public function delete(AbstractResource $resource, FileBag $fileBag, bool $softDelete = true): bool
    {
        if (!$softDelete && $this->fileManager->exists($resource->getUrl())) {
            $pathName = $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$resource->getUrl();
            $fileBag->add($resource->getUrl(), $pathName);
        }

        return true;
    }

    public function supportsFile(File $file): int
    {
        if ('application/pdf' === $file->getMimeType()) {
            return FileAdapterInterface::SUPPORTED;
        }

        return FileAdapterInterface::UNSUPPORTED;
    }

    public function fromFile(File $file): ?array
    {
        return [];
    }
}
