<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Listener\Resource\Types;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Resource\DownloadableResourceInterface;
use Claroline\CoreBundle\Component\Resource\FileAdapterInterface;
use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\File as FileResource;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\Resource\ResourceActionEvent;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use Claroline\EvaluationBundle\Component\Resource\EvaluatedResourceInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Integrates the File resource into Claroline.
 */
final class FileListener extends ResourceComponent implements DownloadableResourceInterface, EvaluatedResourceInterface, FileAdapterInterface
{
    public function __construct(
        private readonly PlatformConfigurationHandler $config,
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer,
        private readonly FileManager $fileManager
    ) {
    }

    public static function getName(): string
    {
        return 'file';
    }

    /** @param FileResource $resource */
    public function open(AbstractResource $resource, bool $embedded = false): ?array
    {
        return [
            'file' => $this->serializer->serialize($resource),
        ];
    }

    /** @param FileResource $resource */
    public function download(AbstractResource $resource, FileBag $fileBag): void
    {
        if ($resource->getUrl() && $this->fileManager->exists($resource->getUrl())) {
            $filePath = $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$resource->getUrl();

            $ext = pathinfo($filePath, PATHINFO_EXTENSION);
            $fileBag->add($resource->getName().'.'.$ext, $filePath);
        }
    }

    /** @param FileResource $resource */
    public function create(AbstractResource $resource, array $data): void
    {
        $filesystem = new Filesystem();

        try {
            $file = new File($resource->getUrl());
        } catch (FileNotFoundException $e) {
            throw new InvalidDataException('Cannot find the file for file resource.');
        }

        $resourceNode = $resource->getResourceNode();
        $workspace = $resourceNode->getWorkspace();
        $workspaceDir = 'WORKSPACE_'.$workspace->getId();

        $filesystem->mkdir([
            $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$workspaceDir,
            $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$workspaceDir.DIRECTORY_SEPARATOR.'file',
        ]);

        $finalPath = $workspaceDir.DIRECTORY_SEPARATOR.'file'.DIRECTORY_SEPARATOR.$resourceNode->getUuid().'.'.$file->guessExtension();
        $filesystem->rename($resource->getUrl(), $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$finalPath);

        $resource->setUrl($finalPath);
        $this->om->persist($resource);
        $this->om->flush();
    }

    /** @param FileResource $resource */
    public function delete(AbstractResource $resource, FileBag $fileBag, bool $softDelete = true): bool
    {
        if (!$softDelete && $this->fileManager->exists($resource->getUrl())) {
            $pathName = $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$resource->getUrl();
            $fileBag->add($resource->getUrl(), $pathName);
        }

        return true;
    }

    /** @param FileResource $resource */
    public function export(AbstractResource $resource, FileBag $fileBag): ?array
    {
        if ($this->fileManager->exists($resource->getUrl())) {
            $path = $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$resource->getUrl();
            $fileBag->add($resource->getUrl(), $path);
        }

        return [];
    }

    /** @param FileResource $resource */
    public function import(AbstractResource $resource, FileBag $fileBag, array $data = []): void
    {
        $workspace = $resource->getResourceNode()->getWorkspace();

        $realFile = $fileBag->get($resource->getUrl());
        if (empty($realFile)) {
            return;
        }

        $hashName = 'WORKSPACE_'.$workspace->getId().DIRECTORY_SEPARATOR.Uuid::uuid4()->toString();
        $ext = pathinfo($realFile, PATHINFO_EXTENSION);
        if ($ext) {
            $hashName .= '.'.$ext;
        }

        $fileSystem = new Filesystem();
        // create workspace dir if missing
        $fileSystem->mkdir($this->fileManager->getDirectory().DIRECTORY_SEPARATOR.'WORKSPACE_'.$workspace->getId());
        $fileSystem->copy($realFile, $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$hashName);

        $resource->setUrl($hashName);

        $this->om->persist($resource);
        $this->om->flush();
    }

    /**
     * @param FileResource $original
     * @param FileResource $copy
     */
    public function copy(AbstractResource $original, AbstractResource $copy): void
    {
        if (!$this->fileManager->exists($original->getUrl())) {
            return;
        }

        $destParent = $original->getResourceNode();
        $workspace = $destParent->getWorkspace();

        $hashName = 'WORKSPACE_'.$workspace->getId().DIRECTORY_SEPARATOR.Uuid::uuid4()->toString();
        $ext = pathinfo($original->getUrl(), PATHINFO_EXTENSION);
        if ($ext) {
            $hashName .= '.'.$ext;
        }
        $fileSystem = new Filesystem();
        // create workspace dir if missing
        $fileSystem->mkdir($this->fileManager->getDirectory().DIRECTORY_SEPARATOR.'WORKSPACE_'.$workspace->getId());
        $fileSystem->copy(
            $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$original->getUrl(),
            $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$hashName
        );

        $copy->setHashName($hashName);
        $copy->setSize($original->getSize());
    }

    /**
     * Changes actual file associated to File resource.
     */
    public function onFileChange(ResourceActionEvent $event): void
    {
        /** @var FileResource $file */
        $file = $event->getResource();
        $node = $event->getResourceNode();
        $data = $event->getData();

        if ($file && !empty($data) && !empty($data['file'])) {
            $file->setUrl($data['file']['url']);
            $file->setSize($data['file']['size']);

            $file->setMimeType($data['file']['mimeType']);
            $node->setMimeType($data['file']['mimeType']);
            $node->setModificationDate(new \DateTime());

            $this->om->persist($file);
            $this->om->persist($node);
            $this->om->flush();
        }

        $event->setResponse(
            new JsonResponse($this->serializer->serialize($node))
        );
    }

    public function supportsFile(File $file): int
    {
        $blacklist = $this->config->getParameter('file_blacklist');
        if (empty($blacklist) || !in_array($file->getMimeType(), $blacklist)) {
            return FileAdapterInterface::SUPPORTED_PARTIAL;
        }

        return FileAdapterInterface::UNSUPPORTED;
    }

    public function fromFile(File $file): ?array
    {
        return [];
    }
}
