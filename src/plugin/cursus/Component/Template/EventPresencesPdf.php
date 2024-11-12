<?php

namespace Claroline\CursusBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;

class EventPresencesPdf extends PdfComponent
{
    public static function getName(): string
    {
        return 'training_event_presences';
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
            'event_presences_table',
        ];
    }
}
