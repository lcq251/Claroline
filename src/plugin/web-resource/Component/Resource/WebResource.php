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
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Resource\DownloadableResourceInterface;
use Claroline\CoreBundle\Component\Resource\FileAdapterInterface;
use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\WebResourceBundle\Manager\WebResourceManager;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File as HttpFile;
use Claroline\AppBundle\Persistence\ObjectManager as Pom;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Entity\AiLessonUsage;
use Claroline\MindMeAiBundle\Entity\Resource\ResourceReference;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;

final class WebResource extends ResourceComponent implements DownloadableResourceInterface, FileAdapterInterface
{
    public function __construct(
        private readonly FileManager $fileManager,
        private readonly string $filesDir,
        private readonly string $uploadDir,
        private readonly WebResourceManager $webResourceManager,
        private readonly SerializerProvider $serializer,
        private readonly ObjectManager $om,
        private readonly AuthorizationCheckerInterface $authChecker
    ) {
    }

    public static function getName(): string
    {
        return 'claroline_web_resource';
    }

    public function requireAdapter(): bool
    {
        return true;
    }

    public function supportsFile(HttpFile $file): int
    {
        if (in_array($file->getMimeType(), ['application/zip', 'application/x-zip-compressed'])) {
            return FileAdapterInterface::SUPPORTED;
        }

        return FileAdapterInterface::UNSUPPORTED;
    }

    public function fromFile(HttpFile $file): ?array
    {
        return [];
    }

    /** @param File $resource */
    public function create(AbstractResource $resource, array $data): void
    {
        if (!empty($resource->getUrl())) {
            $workspace = $resource->getResourceNode()->getWorkspace();
            $tmpFile = new HttpFile($resource->getUrl());

            // generate hash name
            $hashName = Uuid::uuid4()->toString().'.zip';

            // move zip to permanent storage
            $filesPath = $this->filesDir.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR;
            $tmpFile->move($filesPath, $hashName);

            // extract zip for serving
            $this->webResourceManager->unzip($hashName, $workspace);

            // update File entity
            $resource->setHashName($hashName);
            $resource->setUrl($hashName);
            $resource->setSize(filesize($filesPath.$hashName));

            $this->om->persist($resource);
            $this->om->flush();
        }
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

        // Fetch linked ai_lesson context
        $context = $this->getAiLessonContext($resource);

        return [
            'path' => rtrim($srcPath.$ds.$this->webResourceManager->guessRootFileFromUnzipped($unzippedPath.$ds.$hash), '/'),
            // common file data
            'file' => $this->serializer->serialize($resource),
            'aiLessonContext' => $context,
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

        if (file_exists($path)) {
            $fileBag->add($resource->getUrl(), $path);
        }

        return [];
    }

    /** @param File $resource */
    public function import(AbstractResource $resource, FileBag $fileBag, array $data = []): void
    {
        $workspace = $resource->getResourceNode()->getWorkspace();

        $filesPath = $this->uploadDir.DIRECTORY_SEPARATOR.'webresource'.DIRECTORY_SEPARATOR.$workspace->getUuid().DIRECTORY_SEPARATOR.$resource->getHashName();

        $toCopy = $fileBag->get($resource->getUrl());
        if (file_exists($toCopy)) {
            $fileSystem = new Filesystem();
            $fileSystem->mirror($toCopy, $filesPath);
        }
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

    /**
     * Get the ai_lesson context for the web resource (three-layer validation).
     */
    private function getAiLessonContext(AbstractResource $resource): ?array
    {
        $node = $resource->getResourceNode();
        if (!$node) {
            return null;
        }

        // Find linked ai_lesson via ResourceReference
        $references = $this->om->getRepository(ResourceReference::class)->findBy(['host' => $node]);
        $aiLesson = null;
        foreach ($references as $ref) {
            $targetNode = $ref->getTarget();
            if ($targetNode) {
                $aiLesson = $this->om->getRepository(AiLesson::class)->findOneBy(['resourceNode' => $targetNode]);
                if ($aiLesson) {
                    break;
                }
            }
        }

        if (!$aiLesson) {
            return null;
        }

        // Layer 1: OPEN permission
        if (!$this->authChecker->isGranted('OPEN', $node)) {
            return ['allowed' => false, 'reason' => 'no_permission'];
        }

        // Layer 2: expiry
        if ($aiLesson->isExpired()) {
            return [
                'allowed' => false,
                'reason' => 'expired',
                'aiLesson' => ['id' => $aiLesson->getId(), 'name' => $aiLesson->getName(), 'expiresAt' => $aiLesson->getExpiresAt()?->format(\DateTime::ATOM)],
            ];
        }

        // Layer 3: daily quota
        $usageLimit = $aiLesson->getUsageLimit();
        $usageCount = 0;
        $userId = 0; // anonymous fallback

        if ($usageLimit !== null) {
            $usage = $this->om->getRepository(AiLessonUsage::class)->findOneBy([
                'userId' => $userId,
                'aiLessonId' => (int) $aiLesson->getId(),
                'periodDate' => new \DateTime('today'),
            ]);
            if ($usage) {
                $usageCount = $usage->getCount();
                if ($usageCount >= $usage->getLimit()) {
                    return [
                        'allowed' => false,
                        'reason' => 'quota_exceeded',
                        'aiLesson' => ['id' => $aiLesson->getId(), 'name' => $aiLesson->getName(), 'usageLimit' => $usageLimit, 'usageCount' => $usageCount],
                    ];
                }
            }
        }

        return [
            'allowed' => true,
            'aiLesson' => [
                'id' => $aiLesson->getId(),
                'name' => $aiLesson->getName(),
                'expiresAt' => $aiLesson->getExpiresAt()?->format(\DateTime::ATOM),
                'usageLimit' => $usageLimit,
                'usageCount' => $usageCount,
            ],
        ];
    }
}
