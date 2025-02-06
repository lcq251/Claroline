<?php

namespace Icap\LessonBundle\Component\Log\Operational;

use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\LogBundle\Component\Log\AbstractOperationalLog;
use Icap\LessonBundle\Entity\Chapter;

class LogChapter extends AbstractOperationalLog
{
    public static function getName(): string
    {
        return 'lesson_chapter';
    }

    protected static function getEntityClass(): string
    {
        return Chapter::class;
    }

    /** @param Chapter $object */
    protected function getObjectName(object $object): string
    {
        return $object->getTitle();
    }

    /** @param Chapter $object */
    protected function getParentId(object $object): ?string
    {
        return $object->getLesson()?->getResourceNode()?->getUuid();
    }

    /** @param Chapter $object */
    protected function getContext(object $object): string
    {
        return WorkspaceContext::getName();
    }

    /** @param Chapter $object */
    protected function getContextId(object $object): ?string
    {
        return $object->getLesson()?->getResourceNode()?->getWorkspace()?->getUuid();
    }
}
