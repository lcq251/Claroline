<?php

namespace Claroline\ForumBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

class ForumNewMessageEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'forum_new_message';
    }

    public function getPlaceholders(): array
    {
        return [
            'forum',
            'forum_url',
            'subject',
            'subject_url',
            'message',
            'post_datetime_utc',
            'post_date_utc',
            'post_time_utc',
            'post_datetime',
            'post_date',
            'post_time',
            'author',
            'workspace',
            'workspace_url',
        ];
    }
}
