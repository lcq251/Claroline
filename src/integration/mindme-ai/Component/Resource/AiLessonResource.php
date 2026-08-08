<?php

namespace Claroline\MindMeAiBundle\Component\Resource;

use Claroline\CoreBundle\Component\Resource\ResourceComponent;
use Claroline\MindMeAiBundle\Entity\AiLesson;

final class AiLessonResource extends ResourceComponent
{
    public static function getName(): string
    {
        return 'ai_lesson';
    }

    public static function getClass(): string
    {
        return AiLesson::class;
    }
}
