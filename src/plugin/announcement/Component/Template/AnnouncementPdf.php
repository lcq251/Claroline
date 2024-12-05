<?php

namespace Claroline\AnnouncementBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;

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
}
