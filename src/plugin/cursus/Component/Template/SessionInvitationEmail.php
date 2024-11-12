<?php

namespace Claroline\CursusBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

class SessionInvitationEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'training_session_invitation';
    }

    public function getPlaceholders(): array
    {
        return [
            'course_name',
            'course_code',
            'course_description',
            'session_url',
            'session_name',
            'session_description',
            'session_poster',
            'session_start_datetime_utc',
            'session_start_date_utc',
            'session_start_time_utc',
            'session_start_datetime',
            'session_start_date',
            'session_start_time',
            'session_end_datetime_utc',
            'session_end_date_utc',
            'session_end_time_utc',
            'session_end_datetime',
            'session_end_date',
            'session_end_time',
            'session_trainers',
            'workspace_url',
        ];
    }
}
