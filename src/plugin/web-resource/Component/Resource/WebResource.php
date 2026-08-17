<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\WebResourceBundle\Component\Resource;

use Claroline\CoreBundle\Component\Resource\DownloadableResourceInterface;
use Claroline\CoreBundle\Component\Resource\FileAdapterInterface;
use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\CoreBundle\Manager\ObjectManager;
use Claroline\WebResourceBundle\Manager\WebResourceManager;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Filesystem\Filesystem;

final class WebResource extends ResourceComponent implements DownloadableResourceInterface, FileAdapterInterface
{
    public function __construct(
        private readonly FileManager $fileManager,
        private readonly string $filesDir,
        private readonly string $uploadDir,
        private readonly WebResourceManager $webResourceManager,
        private readonly \Claroline\CoreBundle\API\SerializerProvider $serializer,
        private readonly ObjectManager $om
    ) {
    }

    public static function getName(): string
    {
        return 'claroline_web_resource';
    }

    /** @param File $resource */
    public function open(AbstractResource $resource, bool $embedded = false): ?array
    {
        $ds = DIRECTORY_SEPARATOR;

        $hash = $resource->getUrl();
        $workspace = $resource->getResourceNode()->getWorkspace();
        $unzippedPath = $this->uploadDir.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid();

        $srcPath = 'data/uploads'.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR.$hash;
        if (!is_dir($srcPath)) {
            $this->webResourceManager->unzip($hash, $workspace);
        }

        return [
            'path' => rtrim($srcPath.$ds.$this->webResourceManager->guessRootFileFromUnzipped($unzippedPath.$ds.$hash), '/'),
            'file' => null,
        ];
    }

    /** @param File $resource */
    public function download(AbstractResource $resource, \Claroline\AppBundle\API\Utils\FileBag $fileBag): void
    {
        $filePath = $this->filesDir.DIRECTORY_SEPARATOR.'webresource'.
            DIRECTORY_SEPARATOR.$resource->getResourceNode()->getWorkspace()->getUuid().
            DIRECTORY_SEPARATOR.$resource->getUrl();

        if ($resource->getUrl() && $this->fileManager->exists($filePath, true)) {
            $ext = pathinfo($filePath, PATHINFO_EXTENSION);
            $fileBag->add($resource->getName().'.'.$ext, $filePath);
        }
    }

    /** @param File $resource */
    public function export(AbstractResource $resource, \Claroline\AppBundle\API\Utils\FileBag $fileBag): ?array
    {
        $workspace = $resource->getResourceNode()->getWorkspace();

        $path = $this->uploadDir.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR.$resource->getHashName();

        if (file_exists($path)) {
            $fileBag->add($resource->getUrl(), $path);
        }

        return [];
    }

    /** @param File $resource */
    public function create(AbstractResource $resource, array $data = []): void
    {
        // Handle uploaded zip file: persist to permanent storage before unzip() can access it
        if (empty($data['uploaded_file']) || !file_exists($data['uploaded_file']['tmp_name'])) {
            return;
        }

        $workspace = $resource->getResourceNode()->getWorkspace();
        $hashName = Uuid::uuid4()->toString().'.zip';
        $filesPath = $this->filesDir.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid();

        // Persist zip file to permanent storage
        if (!is_dir($filesPath)) {
            $filesystem = new Filesystem();
            $filesystem->mkdir($filesPath, 0755);
        }

        $httpFile = new \Symfony\Component\HttpFoundation\File\UploadedFile(
            $data['uploaded_file']['tmp_name'],
            'webresource.zip',
            'application/zip'
        );
        $destPath = $filesPath.DIRECTORY_SEPARATOR.$hashName;
        $httpFile->move($filesPath, $hashName);

        // Unzip immediately so open() can find files
        $this->webResourceManager->unzip($hashName, $workspace);

        // Update entity with permanent locations
        $resource->setHashName($hashName);
        $resource->setUrl($hashName);
        $resource->setSize(filesize($destPath));

        $this->om->persist($resource);
        $this->om->flush();
    }

    /** @param File $resource */
    public function delete(AbstractResource $resource, \Claroline\AppBundle\API\Utils\FileBag $fileBag, bool $softDelete = true): bool
    {
        if ($softDelete) {
            return true;
        }

        $workspace = $resource->getResourceNode()->getWorkspace();
        $hashName = $resource->getUrl();

        $archiveFile = $this->filesDir.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR.$hashName;
        if (file_exists($archiveFile)) {
            $fileBag->add($hashName.'-archive', $archiveFile);
        }

        return true;
    }

    public function requireAdapter(): bool
    {
        return true;
    }

    public function supportsFile(\SplFileInfo $file): int
    {
        $mimeTypes = ['application/zip', 'application/x-zip-compressed'];
        foreach ($mimeTypes as $type) {
            if (str_contains(strtolower($file->getMimeType()), 'zip')) {
                return FileAdapterInterface::SUPPORTED;
            }
        }

        return FileAdapterInterface::UNSUPPORTED;
    }

    /** @param \SplFileInfo $file */
    public function fromFile(\SplFileInfo $file): ?array
    {
        return ['meta' => ['downloadable' => true]];
    }
}
