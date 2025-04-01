<?php

namespace Claroline\PeerTubeBundle\Manager;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Manager\CurlManager;
use Claroline\CoreBundle\Manager\FileManager;
use Claroline\PeerTubeBundle\Entity\Video;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class PeerTubeManager
{
    public function __construct(
        private readonly CurlManager $curlManager,
        private readonly FileManager $fileManager,
        private readonly Crud $crud,
        private readonly ObjectManager $om
    ) {
    }

    public function checkUrl(string $url): ?string
    {
        // Check if we can parse the given URL
        $urlParts = $this->extractUrlParts($url);
        if (empty($urlParts)) {
            return 'The URL is not a correct PeerTube URL.';
        }

        // Call PeerTube API to know if the ID exists and is accessible
        try {
            $uuid = $this->getVideoUuid($urlParts['server'], $urlParts['shortUuid']);
        } catch (AccessDeniedException $e) {
            // the video requires authentication to be fetched
            return 'You do not have the right to access this video.';
        } catch (NotFoundHttpException $e) {
            // the url doesn't exist
            return 'This video does not exist.';
        }

        if (empty($uuid)) {
            return 'This video does not exist.';
        }

        return null;
    }

    /**
     * Get the PeerTube server URL and the video short UUID from the share URL.
     */
    public function extractUrlParts(string $url): array
    {
        $parts = parse_url($url);
        if ($parts) {
            $server = $parts['scheme'].'://'.$parts['host'];
            $id = str_replace('/w/', '', $parts['path']);
            if (!empty($server) && !empty($id)) {
                return [
                    'server' => $server,
                    'shortUuid' => $id,
                ];
            }
        }

        return [];
    }

    public function getVideoInfo(string $server, string $shortUuid): ?array
    {
        $response = $this->curlManager->exec($server.'/api/v1/videos/'.$shortUuid, null, 'GET', [
            CURLOPT_SSL_VERIFYPEER => 0,
        ]);

        if (!empty($response)) {
            return json_decode($response, true);
        }

        return null;
    }

    public function getVideoUuid(string $server, string $shortUuid): ?string
    {
        $response = $this->getVideoInfo($server, $shortUuid);

        if (!empty($response) && !empty($response['uuid'])) {
            return $response['uuid'];
        }

        return null;
    }

    public function handleThumbnailForVideo(Video $video): void
    {
        $resourceNode = $video->getResourceNode();
        $uploadedFile = $this->getTemporaryThumbnailFile($video->getUrl());

        if ($uploadedFile) {
            $publicFile = $this->crud->create(PublicFile::class, [], ['file' => $uploadedFile]);

            $resourceNode->setThumbnail($publicFile->getUrl());
            $this->om->persist($resourceNode);

            $this->fileManager->linkFile(ResourceNode::class, $resourceNode->getUuid(), $publicFile->getUrl());

            $this->om->flush();
        }
    }

    private function downloadThumbnail(string $server, string $uuid): ?string
    {
        $response = $this->getVideoInfo($server, $uuid);
        if (empty($response) || empty($result['thumbnailPath'])) {
            return null;
        }

        try {
            $thumbnailFile = $this->curlManager->exec($server.$response['thumbnailPath'], null, 'GET', [
                CURLOPT_SSL_VERIFYPEER => 0,
            ]);
        } catch (\Exception) {
            return null;
        }

        return $thumbnailFile;
    }

    private function getTemporaryThumbnailFile(string $url): ?UploadedFile
    {
        $urlParts = $this->extractUrlParts($url);
        if (empty($urlParts)) {
            return null;
        }
        $uuid = $this->getVideoUuid($urlParts['server'], $urlParts['shortUuid']);
        $thumbnailData = $this->downloadThumbnail($urlParts['server'], $uuid);

        if (!$thumbnailData) {
            return null;
        }

        $tempFileName = tempnam(sys_get_temp_dir(), 'peertube_thumbnail');
        file_put_contents($tempFileName, $thumbnailData);

        return new UploadedFile($tempFileName, 'peertube_thumbnail.jpg', 'image/jpeg', null, true);
    }
}
