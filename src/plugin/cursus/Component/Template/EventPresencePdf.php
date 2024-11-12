<?php

namespace Claroline\CursusBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;

class EventPresencePdf extends PdfComponent
{
    public static function getName(): string
    {
        return 'training_event_presence';
    }

    public function getPlaceholders(): array
    {
        return [
            'event_name',
            'event_code',
            'event_description',
            'event_start_datetime_utc',
            'event_start_date_utc',
            'event_start_time_utc',
            'event_start_datetime',
            'event_start_date',
            'event_start_time',
            'event_end_datetime_utc',
            'event_end_date_utc',
            'event_end_time_utc',
            'event_end_datetime',
            'event_end_date',
            'event_end_time',
            'event_presence_status',
            'event_presence_confirmation',
            'event_presence_validation_datetime',
            'event_presence_validation_datetime_utc',
            'user_first_name',
            'user_last_name',
            'user_username',
        ];
    }
}
