<?php

namespace Claroline\OpenBadgeBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class BadgeGrantedEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'badge_granted';
    }

    public function getPlaceholders(): array
    {
        return [
            'badge_name',
            'badge_description',
            'badge_image',
            'badge_image_url',
            'badge_duration',
            'assertion_id',
            'assertion_url',
            'issued_on_datetime_utc',
            'issued_on_date_utc',
            'issued_on_time_utc',
            'issued_on_datetime',
            'issued_on_date',
            'issued_on_time',
            'issuer_name',
            'issuer_email',
        ];
    }

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Awarding of the badge %badge_name%',
                $this->twig->render('@ClarolineOpenBadge/template/badge_granted.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Attribution du badge %badge_name%',
                $this->twig->render('@ClarolineOpenBadge/template/badge_granted.fr.html.twig')
            );
    }
}
