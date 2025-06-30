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

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\CoreBundle\Component\Resource\DownloadableResourceInterface;
use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\WebResourceBundle\Manager\WebResourceManager;
use Symfony\Component\Filesystem\Filesystem;

final class WebResource extends ResourceComponent implements DownloadableResourceInterface
{
    public function __construct(
        private readonly FileManager $fileManager,
        private readonly string $filesDir,
        private readonly string $uploadDir,
        private readonly WebResourceManager $webResourceManager,
        private readonly SerializerProvider $serializer
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
            // common file data
            'file' => $this->serializer->serialize($resource),
        ];
    }

    /** @param File $resource */
    public function download(AbstractResource $resource, FileBag $fileBag): void
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
    public function export(AbstractResource $resource, FileBag $fileBag): ?array
    {
        $workspace = $resource->getResourceNode()->getWorkspace();

        $path = $this->uploadDir.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR.$resource->getHashName();

        $fileBag->add($resource->getUrl(), $path);

        return [];
    }

    /** @param File $resource */
    public function import(AbstractResource $resource, FileBag $fileBag, array $data = []): void
    {
        $workspace = $resource->getResourceNode()->getWorkspace();

        $filesPath = $this->uploadDir.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR.$resource->getHashName();

        $fileSystem = new Filesystem();
        $fileSystem->mirror($fileBag->get($resource->getUrl()), $filesPath);
    }

    /** @param File $resource */
    public function delete(AbstractResource $resource, FileBag $fileBag, bool $softDelete = true): bool
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

        $webResourcesPath = $this->uploadDir.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR.$hashName;
        if (file_exists($webResourcesPath)) {
            $fileBag->add($hashName, $webResourcesPath);
        }

        return true;
    }
}
