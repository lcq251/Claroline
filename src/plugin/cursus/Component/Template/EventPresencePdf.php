<?php

namespace Claroline\CursusBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class EventPresencePdf extends PdfComponent
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

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Certificate of attendance to a training event',
                $this->twig->render('@ClarolineCursus/template/training_event_presence.en.pdf.twig')
            )
            ->addTemplateContent(
                'fr',
                'Attestation de présence à une séance de formation',
                $this->twig->render('@ClarolineCursus/template/training_event_presence.fr.pdf.twig')
            );
    }
}
