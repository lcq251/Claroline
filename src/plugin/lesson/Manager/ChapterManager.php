<?php

namespace Icap\LessonBundle\Manager;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Entity\Lesson;
use Icap\LessonBundle\Repository\ChapterRepository;
use Icap\LessonBundle\Serializer\ChapterSerializer;

class ChapterManager
{
    private ChapterRepository $chapterRepository;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly Crud $crud,
        private readonly ChapterSerializer $chapterSerializer
    ) {
        $this->chapterRepository = $om->getRepository(Chapter::class);
    }

    /**
     * Copy full lesson chapters, from original root to copy root.
     */
    public function copyRoot(Chapter $rootOriginal, Chapter $rootCopy): void
    {
        $rootCopy->setTitle($rootOriginal->getTitle());
        $rootCopy->setText($rootOriginal->getText());
        $rootCopy->setInternalNote($rootOriginal->getInternalNote());

        $this->copyChildren($rootOriginal, $rootCopy);
    }

    public function serializeChapterTree(Lesson $lesson): array
    {
        $tree = $this->om->getRepository(Chapter::class)->buildChapterTree($lesson->getRoot());

        return $this->chapterSerializer->serializeChapterTree($tree[0]);
    }

    /**
     * @throws InvalidDataException
     */
    public function createChapter(Lesson $lesson, array $data = [], Chapter $parent = null): Chapter
    {
        $newChapter = new Chapter();
        $newChapter->setLesson($lesson);

        $this->crud->create($newChapter, $data, [Crud::NO_PERMISSIONS]);

        $this->insertChapter($newChapter, $parent);

        return $newChapter;
    }

    /**
     * @throws InvalidDataException
     */
    public function updateChapter(Chapter $chapter, ?array $data = []): void
    {
        $newParent = $this->chapterRepository->findOneBy(['slug' => $data['parentSlug']]);

        $this->crud->update($chapter, $data);

        // Should the chapter be moved ?
        if (isset($data['move'])) {
            $this->insertChapterInPlace($chapter, $newParent, $data);
        } else {
            $this->om->persist($chapter);
            $this->om->flush();
        }
    }

    private function insertChapterInPlace(Chapter $chapter, ?Chapter $parent = null, ?array $data = []): void
    {
        $position = $data['position'];
        $sibling = $data['order']['sibling'];
        $subchapter = $data['order']['subchapter'];

        switch ($position) {
            case 'subchapter':
                switch ($subchapter) {
                    case 'first':
                        $this->chapterRepository->persistAsFirstChildOf($chapter, $parent);
                        break;
                    case 'last':
                    default:
                        $this->chapterRepository->persistAsLastChildOf($chapter, $parent);
                        break;
                }
                break;
            case 'sibling':
            default:
                switch ($sibling) {
                    case 'before':
                        $previousChapter = $this->chapterRepository->getPreviousSibling($parent);
                        if ($previousChapter) {
                            $this->chapterRepository->persistAsNextSiblingOf($chapter, $previousChapter);
                        } else {
                            $this->chapterRepository->persistAsFirstChildOf($chapter, $parent->getParent());
                        }
                        break;
                    case 'after':
                    default:
                        $this->chapterRepository->persistAsNextSiblingOf($chapter, $parent);
                        break;
                }
                break;
        }

        $this->om->persist($chapter);
        $this->om->flush();
    }

    /**
     * Copy chapter_org subchapters into provided chapter_copy.
     */
    private function copyChapter(Chapter $chapterOrg, Chapter $parent): void
    {
        $chapterCopy = new Chapter();
        $chapterCopy->setLesson($parent->getLesson());
        $chapterCopy->setTitle($chapterOrg->getTitle());
        $chapterCopy->setText($chapterOrg->getText());
        $chapterCopy->setInternalNote($chapterOrg->getInternalNote());

        $this->insertChapter($chapterCopy, $parent);

        $this->copyChildren($chapterOrg, $chapterCopy);
    }

    private function copyChildren(Chapter $chapterOrg, Chapter $chapterCopy): void
    {
        $chapters = $this->chapterRepository->children($chapterOrg, true);
        if (null !== $chapters && count($chapters) > 0) {
            foreach ($chapters as $child) {
                $this->copyChapter($child, $chapterCopy);
            }
        }
    }

    private function insertChapter(Chapter $chapter, Chapter $parent): void
    {
        $this->om->getRepository(Chapter::class)->persistAsLastChildOf($chapter, $parent);
        $this->om->flush();
    }
}
