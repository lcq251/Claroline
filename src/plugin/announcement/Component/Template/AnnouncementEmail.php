<?php

namespace Claroline\AnnouncementBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

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

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                '%title%',
                $this->twig->render('@ClarolineAnnouncement/template/email_announcement.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                '%title%',
                $this->twig->render('@ClarolineAnnouncement/template/email_announcement.fr.html.twig')
            );
    }
}
