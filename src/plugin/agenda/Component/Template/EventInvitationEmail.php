<?php

namespace Claroline\AgendaBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class EventInvitationEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'event_invitation';
    }

    public function getPlaceholders(): array
    {
        return [
            'event_name',
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
            'event_description',
            'event_poster',
            'event_location_name',
            'event_location_address',
            'event_join_url',
            'event_maybe_url',
            'event_decline_url',
        ];
    }

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Invitation to an event',
                $this->twig->render('@ClarolineAgenda/template/event_invitation.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Invitation à un évènement',
                $this->twig->render('@ClarolineAgenda/template/event_invitation.fr.html.twig')
            );
    }
}
