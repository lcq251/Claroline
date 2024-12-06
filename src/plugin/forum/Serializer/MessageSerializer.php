<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Subject;

class MessageSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly ResourceNodeSerializer $nodeSerializer,
        private readonly UserSerializer $userSerializer
    ) {
    }

    public function getClass(): string
    {
        return Message::class;
    }

    public function getName(): string
    {
        return 'forum_message';
    }

    public function getSchema(): string
    {
        return '#/plugin/forum/message.json';
    }

    public function getSamples(): string
    {
        return '#/plugin/forum/message';
    }

    /**
     * Serializes a Message entity.
     */
    public function serialize(Message $message, ?array $options = []): array
    {
        $data = [
            'id' => $message->getUuid(),
            'content' => $message->getContent(),
            'meta' => [
                'creator' => !empty($message->getCreator()) ?
                    $this->userSerializer->serialize($message->getCreator(), [Options::SERIALIZE_MINIMAL]) :
                    null,
                'created' => DateNormalizer::normalize($message->getCreatedAt()),
                'updated' => DateNormalizer::normalize($message->getUpdatedAt()),
            ],
            'parent' => !empty($message->getParent()) ? ['id' => $message->getParent()->getId()] : null,
            'children' => array_map(function (Message $child) use ($options) {
                return $this->serialize($child, $options);
            }, $message->getChildren()->toArray()),
        ];

        $subject = $message->getSubject();

        if ($subject) {
            $data['subject'] = [
                'id' => $subject->getUuid(),
                'title' => $subject->getTitle(),
                'poster' => $subject->getPoster() ? $subject->getPoster()->getUrl() : null,
            ];

            if ($subject->getForum() && $subject->getForum()->getResourceNode()) {
                // required by the data source
                $data['meta']['resource'] = $this->nodeSerializer->serialize($subject->getForum()->getResourceNode(), [Options::SERIALIZE_MINIMAL]);
            }
        }

        $data['meta']['flagged'] = $message->isFlagged();

        return $data;
    }

    /**
     * Deserializes data into a Message entity.
     */
    public function deserialize(array $data, Message $message, ?array $options = []): Message
    {
        $this->sipe('content', 'setContent', $data, $message);

        if (isset($data['meta'])) {
            if (isset($data['meta']['created'])) {
                $message->setCreatedAt(DateNormalizer::denormalize($data['meta']['created']));
            }
            if (isset($data['meta']['updated'])) {
                $message->setUpdatedAt(DateNormalizer::denormalize($data['meta']['updated']));
            }

            if (isset($data['meta']['creator'])) {
                /** @var User $creator */
                $creator = $this->om->getObject($data['meta']['creator'], User::class);
                if ($creator) {
                    $message->setCreator($creator);
                }
            }
        }

        if (isset($data['subject'])) {
            /** @var Subject $subject */
            $subject = $this->om->getObject($data['subject'], Subject::class);

            if (!empty($subject)) {
                $message->setSubject($subject);
            }
        }

        if (isset($data['parent'])) {
            $parent = $this->om->getRepository($this->getClass())->findOneBy(['uuid' => $data['parent']['id']]);

            if ($parent) {
                $message->setParent($parent);
            }
        }
        $this->sipe('meta.flagged', 'setFlagged', $data, $message);

        return $message;
    }
}
