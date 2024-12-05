<?php

namespace Claroline\AnnouncementBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

final class AnnouncementEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'email_announcement';
    }

    public function getPlaceholders(): array
    {
        return [
            'title',
            'author',
            'content',
            'workspace_name',
            'workspace_code',
            'workspace_url',
            'publication_datetime',
            'publication_datetime_utc',
            'publication_date',
            'publication_date_utc',
            'publication_time',
            'publication_time_utc',
        ];
    }
}
