<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AudioPlayerBundle\Component\Resource;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AudioPlayerBundle\Entity\Resource\Audio;
use Claroline\AudioPlayerBundle\Entity\Resource\Section;
use Claroline\AudioPlayerBundle\Manager\AudioPlayerManager;
use Claroline\CoreBundle\Component\Resource\DownloadableResourceInterface;
use Claroline\CoreBundle\Component\Resource\FileAdapterInterface;
use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

final class AudioResource extends ResourceComponent implements DownloadableResourceInterface, FileAdapterInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly SerializerProvider $serializer,
        private readonly FileManager $fileManager,
        private readonly ObjectManager $om,
        private readonly AudioPlayerManager $manager
    ) {
    }

    public static function getName(): string
    {
        return 'audio';
    }

    /** @param Audio $resource */
    public function open(AbstractResource $resource, bool $embedded = false): ?array
    {
        /** @var User|string $user */
        $user = $this->tokenStorage->getToken()?->getUser();

        $resourceNode = $resource->getResourceNode();
        $audioData = $this->serializer->serialize($resource);

        $audioData['sections'] = [];
        switch ($resource->getSectionsType()) {
            case Audio::MANAGER_TYPE:
                $audioData['sections'] = array_values(array_map(function (Section $section) use ($user) {
                    $serializedSection = $this->serializer->serialize($section);

                    if ($user instanceof User) {
                        $userComment = $this->manager->getSectionUserComment($section, $user);

                        if ($userComment) {
                            $serializedSection['comment'] = $this->serializer->serialize($userComment);
                        }
                    }

                    return $serializedSection;
                }, $this->manager->getManagerSections($resourceNode)));
                break;

            case Audio::USER_TYPE:
                if ($user instanceof User) {
                    $audioData['sections'] = array_values(array_map(function (Section $section) use ($user) {
                        $serializedSection = $this->serializer->serialize($section);
                        $userComment = $this->manager->getSectionUserComment($section, $user);

                        if ($userComment) {
                            $serializedSection['comment'] = $this->serializer->serialize($userComment);
                        }

                        return $serializedSection;
                    }, $this->manager->getUserSections($resourceNode, $user)));
                }
                break;
        }

        return [
            'resource' => $audioData,
        ];
    }

    /** @param Audio $resource */
    public function download(AbstractResource $resource, FileBag $fileBag): void
    {
        if ($resource->getUrl() && $this->fileManager->exists($resource->getUrl())) {
            $filePath = $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$resource->getUrl();

            $ext = pathinfo($filePath, PATHINFO_EXTENSION);
            $fileBag->add($resource->getName().'.'.$ext, $filePath);
        }
    }

    /** @param Audio $resource */
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

        $filesystem->mkdir([
            $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$workspaceDir,
            $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$workspaceDir.DIRECTORY_SEPARATOR.'audio',
        ]);

        $finalPath = $workspaceDir.DIRECTORY_SEPARATOR.'audio'.DIRECTORY_SEPARATOR.$resourceNode->getUuid().'.'.$file->guessExtension();
        $filesystem->rename($resource->getUrl(), $this->fileManager->getDirectory().DIRECTORY_SEPARATOR.$finalPath);

        $resource->setUrl($finalPath);
        $this->om->persist($resource);
        $this->om->flush();
    }

    public function update(AbstractResource $resource, array $data): ?array
    {
        $this->manager->deserializeSections($resource->getResourceNode(), $data);

        return [];
    }

    public function supportsFile(File $file): int
    {
        if (str_starts_with($file->getMimeType(), 'audio')) {
            return FileAdapterInterface::SUPPORTED;
        }

        return FileAdapterInterface::UNSUPPORTED;
    }

    public function fromFile(File $file): ?array
    {
        return [];
    }
}
