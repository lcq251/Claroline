<?php

namespace Icap\LessonBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\User;
use Claroline\InstallationBundle\Updater\Helper\RemovePluginTrait;
use Claroline\InstallationBundle\Updater\Helper\RemoveResourceTrait;
use Claroline\InstallationBundle\Updater\NonReplayableUpdaterInterface;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Entity\Lesson;

class Updater150000 extends Updater implements NonReplayableUpdaterInterface
{
    use RemoveResourceTrait;
    use RemovePluginTrait;

    public function __construct(
        private readonly Connection $connection,
        private readonly ObjectManager $om
    ) {
    }

    public function postUpdate(): void
    {
        $lessonType = $this->om->getRepository(ResourceType::class)->findOneBy([
            'name' => 'icap_lesson',
        ]);

        if (empty($lessonType)) {
            return;
        }

        $this->migrateTexts($lessonType);
        $this->migrateBlogs($lessonType);
        $this->migrateWikis($lessonType);

        $this->removeResource('text');
        $this->removePlugin('Icap', 'BlogBundle');
        $this->removePlugin('Icap', 'WikiBundle');
    }

    private function migrateTexts(ResourceType $resourceType): void
    {
        // change node type to the lesson one
        $updateNode = $this->connection->prepare('
            UPDATE claro_resource_node 
            SET mime_type = "custom/icap_lesson", resource_type_id = :resourceType
            WHERE mime_type = "custom/text"
        ');

        $updateNode->bindValue('resourceType', $resourceType->getId());
        $updateNode->executeQuery();

        $selectText = $this->connection->prepare('
            SELECT n.uuid, r.user_id, r.content
            FROM claro_text_revision AS r
            LEFT JOIN claro_text AS t ON r.text_id = t.id 
            LEFT JOIN claro_resource_node AS n ON t.resourceNode_id = n.id
            WHERE r.version IN (
                SELECT MAX(r2.version)
                FROM claro_text_revision AS r2
                WHERE r2.text_id  = r.text_id
            )
        ');

        $results = $selectText->executeQuery();

        foreach ($results->iterateAssociative() as $i => $result) {
            $resourceNode = $this->om->getRepository(ResourceNode::class)->findOneBy([
                'uuid' => $result['uuid'],
            ]);

            if (empty($resourceNode)) {
                continue;
            }

            $creator = null;
            if (!empty($result['user_id'])) {
                $creator = $this->om->getRepository(User::class)->find($result['user_id']);
            }

            $lesson = $this->om->getRepository(Lesson::class)->findOneBy(['resourceNode' => $resourceNode]);
            if (empty($lesson)) {
                $lesson = new Lesson();
                $lesson->setResourceNode($resourceNode);
            }

            $lesson->buildRoot();
            $this->om->persist($lesson);

            $chapter = new Chapter();
            $chapter->setCreator($creator);
            $chapter->setTitle($resourceNode->getName());
            $chapter->setText($result['content']);
            $chapter->setLesson($lesson);
            $this->om->persist($chapter);

            $this->om->getRepository(Chapter::class)->persistAsLastChildOf($chapter, $lesson->getRoot());

            if (0 === $i % 100) {
                $this->om->flush();
            }
        }

        $this->om->flush();
        $this->om->clear();
    }

    private function migrateBlogs(ResourceType $resourceType): void
    {
        // change node type to the lesson one
        $updateNode = $this->connection->prepare('
            UPDATE claro_resource_node 
            SET mime_type = "custom/icap_lesson", resource_type_id = :resourceType
            WHERE mime_type = "custom/icap_blog"
        ');

        $updateNode->bindValue('resourceType', $resourceType->getId());
        $updateNode->executeQuery();

        $selectBlog = $this->connection->prepare('
            SELECT n.uuid, p.creator_id, p.title, p.content, p.creation_date, p.modification_date, p.poster
            FROM icap__blog_post AS p
            LEFT JOIN icap__blog AS b ON p.blog_id = b.id 
            LEFT JOIN claro_resource_node AS n ON b.resourceNode_id = n.id
        ');

        $results = $selectBlog->executeQuery();

        foreach ($results->iterateAssociative() as $i => $result) {
            $resourceNode = $this->om->getRepository(ResourceNode::class)->findOneBy([
                'uuid' => $result['uuid'],
            ]);

            if (empty($resourceNode)) {
                continue;
            }

            $creator = null;
            if (!empty($result['creator_id'])) {
                $creator = $this->om->getRepository(User::class)->find($result['creator_id']);
            }

            $lesson = $this->om->getRepository(Lesson::class)->findOneBy(['resourceNode' => $resourceNode]);
            if (empty($lesson)) {
                $lesson = new Lesson();
                $lesson->setResourceNode($resourceNode);
            }

            $lesson->setShowMeta(true);
            $lesson->setNavigation(true);
            $lesson->buildRoot();
            $this->om->persist($lesson);

            $chapter = new Chapter();
            $chapter->setCreator($creator);
            $chapter->setTitle($result['title']);
            $chapter->setText($result['content']);
            $chapter->setPoster($result['poster']);
            if (!empty($result['modification_date'])) {
                $chapter->setUpdatedAt(new \DateTime($result['modification_date']));
            }
            if (!empty($result['creation_date'])) {
                $chapter->setCreatedAt(new \DateTime($result['creation_date']));
            }

            $chapter->setLesson($lesson);
            $this->om->persist($chapter);

            $this->om->getRepository(Chapter::class)->persistAsLastChildOf($chapter, $lesson->getRoot());

            if (0 === $i % 100) {
                $this->om->flush();
            }
        }

        $this->om->flush();
        $this->om->clear();
    }

    private function migrateWikis(ResourceType $resourceType): void
    {
        // change node type to the lesson one
        $updateNode = $this->connection->prepare('
            UPDATE claro_resource_node 
            SET mime_type = "custom/icap_lesson", resource_type_id = :resourceType
            WHERE mime_type = "custom/icap_wiki"
        ');

        $updateNode->bindValue('resourceType', $resourceType->getId());
        $updateNode->executeQuery();

        $selectBlog = $this->connection->prepare('
            SELECT n.uuid, w.displaySectionNumbers, w.id
            FROM icap__wiki AS w 
            LEFT JOIN claro_resource_node AS n ON w.resourceNode_id = n.id
        ');

        $results = $selectBlog->executeQuery();

        foreach ($results->iterateAssociative() as $wiki) {
            $resourceNode = $this->om->getRepository(ResourceNode::class)->findOneBy([
                'uuid' => $wiki['uuid'],
            ]);

            if (empty($resourceNode)) {
                continue;
            }

            $lesson = $this->om->getRepository(Lesson::class)->findOneBy(['resourceNode' => $resourceNode]);
            if (empty($lesson)) {
                $lesson = new Lesson();
                $lesson->setResourceNode($resourceNode);
            }

            $lesson->setShowMeta(true);
            $lesson->setNavigation(false);
            $lesson->setNumbering($wiki['displaySectionNumbers'] ? 'numeric' : 'none');
            $this->om->persist($lesson);

            $selectSections = $this->connection->prepare('
                SELECT s.id, s.root, s.parent_id, s.lft, s.lvl, s.rgt, s.root, c.title, c.text, c.creation_date, c.user_id
                FROM icap__wiki_section AS s
                JOIN icap__wiki_contribution AS c ON s.active_contribution_id = c.id
                WHERE s.wiki_id = :wikiId
                  AND s.deleted = 0
                ORDER BY s.lft 
            ');
            $selectSections->bindValue('wikiId', $wiki['id']);
            $selectSections->executeQuery();

            $pages = [];
            $sectionResults = $selectSections->executeQuery();
            foreach ($sectionResults->iterateAssociative() as $section) {
                $creator = null;
                if (!empty($section['user_id'])) {
                    $creator = $this->om->getRepository(User::class)->find($section['user_id']);
                }

                $chapter = new Chapter();
                $chapter->setCreator($creator);
                $chapter->setTitle($section['title'] ?: $lesson->getName());
                $chapter->setText($section['text']);
                $chapter->setLevel($section['lvl']);
                if (!empty($section['creation_date'])) {
                    $chapter->setCreatedAt(new \DateTime($section['creation_date']));
                    $chapter->setUpdatedAt(new \DateTime($section['creation_date']));
                }

                $chapter->setLesson($lesson);
                $this->om->persist($chapter);

                if ($section['id'] === $section['root']) {
                    $lesson->setRoot($chapter);
                } else {
                    $this->om->getRepository(Chapter::class)->persistAsLastChildOf($chapter, $lesson->getRoot());
                }

                $pages[$section['id']] = [
                    'entity' => $chapter,
                    'parent' => $section['parent_id'],
                    'root' => $section['root'],
                    'lft' => $section['lft'],
                    'rgt' => $section['rgt'],
                    'lvl' => $section['lvl'],
                ];
            }

            $this->om->flush(); // we need to flush to get the auto id and rebuild the tree

            // rebuild wiki tree
            foreach ($pages as $page) {
                if ($page['parent'] && !empty($pages[$page['parent']]) && $pages[$page['parent']]['entity']) {
                    // $page['entity']->setParent($pages[$page['parent']]['entity']);
                    $this->om->getRepository(Chapter::class)->persistAsLastChildOf($page['entity'], $pages[$page['parent']]['entity']);
                }

                $page['entity']->setLevel($page['lvl']);
            }

            $this->om->flush();
        }

        $this->om->clear();
    }
}
