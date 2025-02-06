<?php

namespace Icap\LessonBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Repository\ChapterRepository;

class ChapterSerializer
{
    use SerializerTrait;

    public const INCLUDE_INTERNAL_NOTES = 'include_internal_notes';

    private ChapterRepository $chapterRepository;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly UserSerializer $userSerializer
    ) {
        $this->chapterRepository = $om->getRepository(Chapter::class);
    }

    public function getClass(): string
    {
        return Chapter::class;
    }

    public function getName(): string
    {
        return 'lesson_chapter';
    }

    public function getSchema(): string
    {
        return '#/plugin/lesson/chapter.json';
    }

    /**
     * Serializes a Chapter entity for the JSON api.
     *
     * @param Chapter $chapter - the Chapter resource to serialize
     * @param array   $options - a list of serialization options
     *
     * @return array - the serialized representation of the Chapter resource
     */
    public function serialize(Chapter $chapter, array $options = []): array
    {
        if (in_array(SerializerInterface::SERIALIZE_MINIMAL, $options)) {
            return [
                'id' => $chapter->getUuid(),
                'slug' => $chapter->getSlug(),
                'title' => $chapter->getTitle(),
            ];
        }

        $previousChapter = $this->chapterRepository->getPreviousChapter($chapter);
        $nextChapter = $this->chapterRepository->getNextChapter($chapter);

        $serialized = [
            'id' => $chapter->getUuid(),
            'slug' => $chapter->getSlug(),
            'title' => $chapter->getTitle(),
            'poster' => $chapter->getPoster(),
            'text' => $chapter->getText(),
            'meta' => [
                'createdAt' => DateNormalizer::normalize($chapter->getCreatedAt()),
                'updatedAt' => DateNormalizer::normalize($chapter->getUpdatedAt()),
                'creator' => $chapter->getCreator() ? $this->userSerializer->serialize($chapter->getCreator(), [SerializerInterface::SERIALIZE_MINIMAL]) : null,
            ],
            'customNumbering' => $chapter->getCustomNumbering(),
            'parentSlug' => $chapter->getParent()?->getSlug(),
            'previousSlug' => $previousChapter?->getSlug(),
            'nextSlug' => $nextChapter?->getSlug(),
        ];

        if (in_array(static::INCLUDE_INTERNAL_NOTES, $options)) {
            $serialized['internalNote'] = $chapter->getInternalNote();
        }

        return $serialized;
    }

    /**
     * Serializes a chapter tree, returned from Gedmo tree extension.
     *
     * @return array
     */
    public function serializeChapterTree($tree): array
    {
        return $this->serializeChapterTreeNode($tree);
    }

    public function deserialize(array $data, Chapter $chapter = null): Chapter
    {
        if (empty($chapter)) {
            $chapter = new Chapter();
        }

        $this->sipe('title', 'setTitle', $data, $chapter);
        $this->sipe('text', 'setText', $data, $chapter);
        $this->sipe('customNumbering', 'setCustomNumbering', $data, $chapter);
        $this->sipe('poster', 'setPoster', $data, $chapter);
        $this->sipe('internalNote', 'setInternalNote', $data, $chapter);

        if (isset($data['meta'])) {
            if (array_key_exists('created', $data['meta'])) {
                $chapter->setCreatedAt(DateNormalizer::denormalize($data['meta']['created']));
            }
            if (array_key_exists('updated', $data['meta'])) {
                $chapter->setUpdatedAt(DateNormalizer::denormalize($data['meta']['updated']));
            }

            if (array_key_exists('creator', $data['meta'])) {
                $creator = null;
                if (!empty($data['meta']['creator'])) {
                    /** @var User $creator */
                    $creator = $this->om->getObject($data['meta']['creator'], User::class);
                }

                $chapter->setCreator($creator);
            }
        }

        return $chapter;
    }

    private function serializeChapterTreeNode(array $node): array
    {
        $children = [];

        if (!empty($node['__children'])) {
            foreach ($node['__children'] as $child) {
                $children[] = $this->serializeChapterTreeNode($child);
            }
        }

        return [
            'id' => $node['uuid'],
            'title' => $node['title'],
            'slug' => $node['slug'],
            'children' => $children,
        ];
    }
}
