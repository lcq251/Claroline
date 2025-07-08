<?php

namespace Claroline\CursusBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class EventPresencesPdf extends PdfComponent
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

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Attendance grid for a training event',
                $this->twig->render('@ClarolineCursus/template/training_event_presences.en.pdf.twig')
            )
            ->addTemplateContent(
                'fr',
                'Grille de présence d\'une séance de formation',
                $this->twig->render('@ClarolineCursus/template/training_event_presences.fr.pdf.twig')
            );
    }
}
