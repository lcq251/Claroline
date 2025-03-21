<?php

namespace Claroline\YouTubeBundle\Component\Resource;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\CoreBundle\Component\Resource\UrlAdapterInterface;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\User;
use Claroline\EvaluationBundle\Component\Resource\EvaluatedResourceInterface;
use Claroline\YouTubeBundle\Entity\Video;
use Claroline\YouTubeBundle\Manager\EvaluationManager;
use Claroline\YouTubeBundle\Manager\YouTubeManager;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class VideoResource extends ResourceComponent implements EvaluatedResourceInterface, UrlAdapterInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly SerializerProvider $serializer,
        private readonly EvaluationManager $evaluationManager,
        private readonly YouTubeManager $youtubeManager
    ) {
    }

    public static function getName(): string
    {
        return 'youtube_video';
    }

    public static function getSubscribedEvents(): array
    {
        return array_merge([], parent::getSubscribedEvents(), [
            CrudEvents::getEventName(CrudEvents::POST_CREATE, Video::class) => 'onCrudCreate',
        ]);
    }

    public function supportsUrl(string $url): int
    {
        if (str_starts_with($url, 'https://www.youtube.com')) {
            return UrlAdapterInterface::SUPPORTED;
        }

        return UrlAdapterInterface::UNSUPPORTED;
    }

    public function fromUrl(string $url): ?array
    {
        // https://www.googleapis.com/youtube/v3/videos?part=snippet&id=eUUviFnGnBE&key=API_KEY

        return [
            // snippet.title
            // snippet.description
            // snippet.thumbnails.default|snippet.thumbnails.medium|snippet.thumbnails.high|snippet.thumbnails.standard
            'thumbnail' => $this->youtubeManager->getThumbnailUrl($url),
        ];
    }

    /** @param Video $resource */
    public function open(AbstractResource $resource, bool $embedded = false): ?array
    {
        $user = $this->tokenStorage->getToken()?->getUser();

        return [
            'resource' => $this->serializer->serialize($resource),
            'userEvaluation' => $user instanceof User ? $this->serializer->serialize(
                $this->evaluationManager->getResourceUserEvaluation($resource->getResourceNode(), $user),
                [SerializerInterface::SERIALIZE_MINIMAL]
            ) : null,
            'url' => $resource->getUrl(),
        ];
    }

    /** @param Video $resource */
    public function update(AbstractResource $resource, array $data): ?array
    {
        $this->youtubeManager->handleThumbnailForVideo($resource);

        return [
            'resource' => $this->serializer->serialize($resource),
        ];
    }

    public function onCrudCreate(CreateEvent $event): void
    {
        $video = $event->getObject();
        $this->youtubeManager->handleThumbnailForVideo($video);
    }
}
