<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ScormBundle\Component\Resource;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Resource\DownloadableResourceInterface;
use Claroline\CoreBundle\Component\Resource\FileAdapterInterface;
use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\Resource\ResourceActionEvent;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\EvaluationBundle\Component\Resource\EvaluatedResourceInterface;
use Claroline\ScormBundle\Entity\Scorm;
use Claroline\ScormBundle\Manager\EvaluationManager;
use Claroline\ScormBundle\Manager\ScormManager;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

final class ScormResource extends ResourceComponent implements DownloadableResourceInterface, EvaluatedResourceInterface, FileAdapterInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer,
        private readonly ScormManager $scormManager,
        private readonly EvaluationManager $evaluationManager,
        private readonly FileManager $fileManager,
        private readonly string $filesDir,
        private readonly string $uploadDir
    ) {
    }

    public static function getName(): string
    {
        return 'claroline_scorm';
    }

    /** @param Scorm $resource */
    public function open(AbstractResource $resource, bool $embedded = false): ?array
    {
        $evaluation = null;
        $tracking = [];

        /** @var User $user */
        $user = $this->tokenStorage->getToken()?->getUser();
        if ($user instanceof User) {
            // retrieve user progression
            $evaluation = $this->serializer->serialize(
                $this->evaluationManager->getResourceUserEvaluation($resource, $user),
                [SerializerInterface::SERIALIZE_MINIMAL]
            );

            // retrieve progression for each sco in the scorm
            $tracking = $this->evaluationManager->generateScosTrackings($resource->getRootScos(), $user);
        }

        return [
            'scorm' => $this->serializer->serialize($resource),
            'userEvaluation' => $evaluation,
            'trackings' => $tracking,
        ];
    }

    /** @param Scorm $resource */
    public function create(AbstractResource $resource, array $data): void
    {
        $data = $this->scormManager->uploadScormArchive($resource->getResourceNode()->getWorkspace(), new File($resource->getUrl()));

        $resource->setUrl($data['url']);
        $this->om->persist($resource);
        $this->om->flush();
    }

    /** @param Scorm $resource */
    public function download(AbstractResource $resource, FileBag $fileBag): void
    {
        $filePath = $this->getScormArchive($resource);

        if ($filePath && $this->fileManager->exists($filePath, true)) {
            $fileBag->add($resource->getName(), $filePath);
        }
    }

    /** @param Scorm $resource */
    public function delete(AbstractResource $resource, FileBag $fileBag, bool $softDelete = true): bool
    {
        if ($softDelete) {
            return true;
        }

        $workspace = $resource->getResourceNode()->getWorkspace();
        $hashName = $resource->getHashName();

        $nbScorm = (int) $this->om->getRepository(Scorm::class)->findNbScormWithSameSource($hashName, $workspace);
        if (1 === $nbScorm) {
            $scormArchiveFile = $this->filesDir.DIRECTORY_SEPARATOR.'scorm'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR.$hashName;
            if (file_exists($scormArchiveFile)) {
                $fileBag->add($hashName.'-archive', $scormArchiveFile);
            }

            $scormResourcesPath = $this->uploadDir.DIRECTORY_SEPARATOR.'scorm'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR.$hashName;
            if (file_exists($scormResourcesPath)) {
                $fileBag->add($hashName, $scormResourcesPath);
            }
        }

        return true;
    }

    /** @param Scorm $resource */
    public function export(AbstractResource $resource, FileBag $fileBag): ?array
    {
        // get the file path
        $fileBag->add($resource->getUrl(), $this->getScormArchive($resource));

        return [];
    }

    /** @param Scorm $resource */
    public function import(AbstractResource $resource, FileBag $fileBag, array $data = []): void
    {
        $resourceNode = $resource->getResourceNode();

        try {
            $file = new File($fileBag->get($resource->getUrl()));
            $this->scormManager->unzipScormArchive($resourceNode->getWorkspace(), $file, $resource->getUrl());
        } catch (\Exception $e) {
            // scorm was invalid.
        }
    }

    /**
     * @param Scorm $original
     * @param Scorm $copy
     */
    public function copy(AbstractResource $original, AbstractResource $copy): void
    {
        $this->scormManager->copy($original, $copy->getResourceNode()->getWorkspace());
    }

    public function onFileChange(ResourceActionEvent $event): void
    {
        /** @var ResourceNode $node */
        $node = $event->getResourceNode();
        /** @var Scorm $scorm */
        $scorm = $event->getResource();

        $parameters = $event->getData();
        $filePath = $parameters['file']['url'];

        if (!empty($filePath)) {
            $data = $this->scormManager->uploadScormArchive($node->getWorkspace(), new File($this->filesDir.DIRECTORY_SEPARATOR.$filePath));
            if ($data) {
                $oldFile = $scorm->getHashName();

                // update scorm
                $scorm = $this->serializer->deserialize($data, $scorm);

                // remove old zip
                unlink($this->filesDir.DIRECTORY_SEPARATOR.'scorm'.DIRECTORY_SEPARATOR.$node->getWorkspace()->getUuid().DIRECTORY_SEPARATOR.$oldFile);
                // remove old unzipped scorm
                $this->deleteFiles($this->uploadDir.DIRECTORY_SEPARATOR.'scorm'.DIRECTORY_SEPARATOR.$node->getWorkspace()->getUuid().DIRECTORY_SEPARATOR.$oldFile);

                $this->om->persist($scorm);
                $this->om->flush();
            }
        }

        $event->setResponse(new JsonResponse($this->serializer->serialize($node)));
    }

    private function getScormArchive(Scorm $scorm): string
    {
        $workspace = $scorm->getResourceNode()->getWorkspace();
        $ds = DIRECTORY_SEPARATOR;
        $supposedArchiveLocation = $this->filesDir.$ds.'scorm'.$ds.$workspace->getUuid().$ds.$scorm->getHashName();

        if (is_file($supposedArchiveLocation)) {
            return $supposedArchiveLocation;
        }

        $uploadArchiveLocation = $this->uploadDir.$ds.'scorm'.$ds.$workspace->getUuid().$ds.$scorm->getHashName();

        if (!is_dir($this->filesDir.$ds.'scorm'.$ds.$workspace->getUuid())) {
            mkdir($this->filesDir.$ds.'scorm'.$ds.$workspace->getUuid());
        }
        // initialize the ZIP archive
        $zip = new \ZipArchive();
        $zip->open($supposedArchiveLocation, \ZipArchive::CREATE);

        // create recursive directory iterator
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($uploadArchiveLocation), \RecursiveIteratorIterator::LEAVES_ONLY);

        // let's iterate
        foreach ($files as $file) {
            $filePath = $file->getRealPath();

            if (file_exists($filePath) && is_file($filePath)) {
                $rel = $this->getRelativePath($filePath, $scorm->getHashName(), $workspace->getUuid());
                $zip->addFile($filePath, $rel);
            }
        }

        $zip->close();

        return $supposedArchiveLocation;
    }

    public function supportsFile(File $file): int
    {
        // Checks if it is a valid scorm archive
        $zip = new \ZipArchive();
        $openValue = $zip->open($file);

        if (true === $openValue && $zip->getStream('imsmanifest.xml')) {
            return FileAdapterInterface::SUPPORTED;
        }

        return FileAdapterInterface::UNSUPPORTED;
    }

    public function fromFile(File $file): ?array
    {
        return $this->scormManager->parseScormArchive($file);
    }

    /**
     * Gets the relative path between 2 instances (not optimized yet).
     */
    private function getRelativePath(string $current, string $hashName, string $wuid): string
    {
        return substr($current, strlen(realpath($this->uploadDir).'/scorm/'.$wuid.'/'.$hashName.'/'));
    }

    /**
     * Deletes recursively a directory and its content.
     */
    private function deleteFiles(string $dirPath = ''): void
    {
        foreach (glob($dirPath.DIRECTORY_SEPARATOR.'{*,.[!.]*,..?*}', GLOB_BRACE) as $content) {
            if (is_dir($content)) {
                $this->deleteFiles($content);
            } else {
                unlink($content);
            }
        }
        rmdir($dirPath);
    }

    public function requireAdapter(): bool
    {
        return true;
    }
}
