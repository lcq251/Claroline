<?php

namespace Icap\LessonBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\User;
use Claroline\InstallationBundle\Updater\Helper\RemoveResourceTrait;
use Claroline\InstallationBundle\Updater\NonReplayableUpdaterInterface;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Entity\Lesson;

class Updater150000 extends Updater implements NonReplayableUpdaterInterface
{
    use RemoveResourceTrait;

    public function __construct(
        private readonly Connection $connection,
        private readonly ObjectManager $om
    ) {
    }

    public function postUpdate(): void
    {
        $this->migrateTexts();
        $this->removeResource('text');
    }

    private function migrateTexts(): void
    {
        $textType = $this->om->getRepository(ResourceType::class)->findOneBy([
            'name' => 'icap_lesson',
        ]);

        if (empty($textType)) {
            return;
        }

        $updateNode = $this->connection->prepare('
            UPDATE claro_resource_node 
            SET mime_type = "custom/icap_lesson", resource_type_id = :resourceType
            WHERE mime_type = "custom/text"
        ');

        $updateNode->bindValue('resourceType', $textType->getId());
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

            $creator = $this->om->getRepository(User::class)->find($result['user_id']);

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
}
