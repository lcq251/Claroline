<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\Entity\AbstractMessage;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;

class MessageSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly UserSerializer $userSerializer,
        private readonly ObjectManager $om
    ) {
    }

    public function getClass(): string
    {
        return AbstractMessage::class;
    }

    public function getName(): string
    {
        return 'abstract_message';
    }

    public function getSchema(): string
    {
        return '#/main/core/message.json';
    }

    public function serialize(AbstractMessage $message, array $options = []): array
    {
        return [
            'id' => $message->getUuid(),
            'content' => $message->getContent(),
            'meta' => [
                'creator' => $this->serializeCreator($message),
                'created' => DateNormalizer::normalize($message->getCreationDate()),
                'updated' => DateNormalizer::normalize($message->getModificationDate()),
                'flagged' => $message->isFlagged(),
                'moderation' => $message->getModerated(),
            ],
            'parent' => $this->serializeParent($message),
            'children' => array_map(function (AbstractMessage $child) use ($options) {
                return $this->serialize($child, $options);
            }, $message->getChildren()->toArray()),
        ];
    }

    public function deserialize(array $data, AbstractMessage $message, array $options = []): AbstractMessage
    {
        $this->sipe('content', 'setContent', $data, $message);

        if (isset($data['meta'])) {
            if (isset($data['meta']['updated'])) {
                $message->setModificationDate(DateNormalizer::denormalize($data['meta']['updated']));
            }

            if (isset($data['meta']['creator'])) {
                $message->setAuthor($data['meta']['creator']['name']);

                /** @var User $creator */
                $creator = $this->om->getObject($data['meta']['creator'], User::class);
                if ($creator) {
                    $message->setCreator($creator);
                }
            }
        }

        return $message;
    }

    private function serializeCreator(AbstractMessage $message): array
    {
        if (!empty($message->getCreator())) {
            return $this->userSerializer->serialize($message->getCreator(), [Options::SERIALIZE_MINIMAL]);
        }

        return [
            'name' => $message->getAuthor(),
        ];
    }

    private function serializeParent(AbstractMessage $message): ?array
    {
        $parent = null;
        if ($message->getParent()) {
            $parent = ['id' => $message->getParent()->getId()];
        }

        return $parent;
    }
}
