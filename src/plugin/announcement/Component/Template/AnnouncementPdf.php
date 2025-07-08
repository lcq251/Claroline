<?php

namespace Claroline\AnnouncementBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class AnnouncementPdf extends PdfComponent
{
    public static function getName(): string
    {
        return 'pdf_announcement';
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
                $this->twig->render('@ClarolineAnnouncement/template/pdf_announcement.en.pdf.twig')
            )
            ->addTemplateContent(
                'fr',
                '%title%',
                $this->twig->render('@ClarolineAnnouncement/template/pdf_announcement.fr.pdf.twig')
            );
    }
}
