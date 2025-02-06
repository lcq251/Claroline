<?php

namespace Icap\LessonBundle\Repository;

use Doctrine\ORM\NoResultException;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;
use Icap\LessonBundle\Entity\Chapter;

class ChapterRepository extends NestedTreeRepository
{
    public function getChapterTree(Chapter $chapter, bool $includeChapter = true)
    {
        return $this->childrenHierarchy($chapter, false, [], $includeChapter);
    }

    public function buildChapterTree(Chapter $chapter): array
    {
        $queryBuilder = $this->createQueryBuilder('chapter')
            ->select('chapter.uuid, chapter.level, chapter.title, chapter.slug, chapter.text, chapter.poster, chapter.customNumbering')
            ->andWhere('chapter.root = :rootId')
            ->orderBy('chapter.root, chapter.left', 'ASC')
            ->setParameter('rootId', $chapter->getId());

        return $this->buildTree($queryBuilder->getQuery()->getArrayResult(), ['decorate' => false]);
    }

    public function getChapterAndChapterChildren(Chapter $chapter): array
    {
        return $this->children($chapter, false, null, 'ASC', true);
    }

    public function getChapterChildren(Chapter $chapter): array
    {
        return $this->children($chapter, false, null, 'ASC', false);
    }

    public function getChapterFirstChild(Chapter $chapter): ?Chapter
    {
        try {
            return $this->childrenQueryBuilder($chapter)
                ->setFirstResult(0)
                ->setMaxResults(1)
                ->getQuery()
                ->getSingleResult();
        } catch (NoResultException $e) {
            return null;
        }
    }

    public function getChapterAndDirectChapterChildren(Chapter $chapter)
    {
        return $this->children($chapter, true, null, 'ASC', true);
    }

    public function getDirectChapterChildren(Chapter $chapter): array
    {
        return $this->children($chapter, true, null, 'ASC', false);
    }

    public function getNextSibling(Chapter $chapter): ?Chapter
    {
        try {
            return $this->getNextSiblingsQueryBuilder($chapter)
                ->setFirstResult(0)
                ->setMaxResults(1)
                ->getQuery()
                ->getSingleResult();
        } catch (NoResultException $e) {
            return null;
        }
    }

    public function getPreviousSibling(Chapter $chapter): ?Chapter
    {
        try {
            return $this->getPrevSiblingsQueryBuilder($chapter)
                ->setFirstResult(0)
                ->setMaxResults(1)
                ->getQuery()
                ->getSingleResult();
        } catch (NoResultException $e) {
            return null;
        }
    }

    public function getNextChapter(Chapter $chapter): ?Chapter
    {
        try {
            $qb = $this->getEntityManager()->createQueryBuilder();

            return $this->getEntityManager()->createQueryBuilder()->add('select', 'c')
                ->add('from', 'Icap\LessonBundle\Entity\Chapter c')
                ->innerJoin('c.lesson', ' l')
                ->where($qb->expr()->andx(
                    $qb->expr()->gt('c.left', '?1'),
                    $qb->expr()->eq('l.id', '?2')
                ))
                ->orderBy('c.left', 'ASC')
                ->setParameter(1, $chapter->getLeft())
                ->setParameter(2, $chapter->getLesson())
                ->setFirstResult(0)
                ->setMaxResults(1)
                ->getQuery()
                ->getSingleResult();
        } catch (NoResultException $e) {
            return null;
        }
    }

    public function getPreviousChapter(Chapter $chapter): ?Chapter
    {
        try {
            $qb = $this->getEntityManager()->createQueryBuilder();

            return $this->getEntityManager()->createQueryBuilder()->add('select', 'c')
                ->add('from', 'Icap\LessonBundle\Entity\Chapter c')
                ->innerJoin('c.lesson', ' l')
                ->where($qb->expr()->andx(
                    $qb->expr()->lt('c.left', '?1'),
                    $qb->expr()->eq('l.id', '?2'),
                    $qb->expr()->not($qb->expr()->eq('c.id', '?3'))
                ))
                ->orderBy('c.left', 'DESC')
                ->setParameter(1, $chapter->getLeft())
                ->setParameter(2, $chapter->getLesson()->getId())
                ->setParameter(3, $chapter->getLesson()->getRoot()->getId())
                ->setFirstResult(0)
                ->setMaxResults(1)
                ->getQuery()
                ->getSingleResult();
        } catch (NoResultException $e) {
            return null;
        }
    }

    public function getChapterBySlug(string $chapterSlug, int $lessonId): ?Chapter
    {
        try {
            $qb = $this->getEntityManager()->createQueryBuilder();

            return $this->getEntityManager()->createQueryBuilder()->add('select', 'c')
                ->add('from', 'Icap\LessonBundle\Entity\Chapter c')
                ->innerJoin('c.lesson', ' l')
                ->where($qb->expr()->andx(
                    $qb->expr()->eq('c.slug', '?1'),
                    $qb->expr()->eq('l.id', '?2')
                ))
                ->setParameter(1, $chapterSlug)
                ->setParameter(2, $lessonId)
                ->getQuery()
                ->getSingleResult();
        } catch (NoResultException $e) {
            return null;
        }
    }
}
