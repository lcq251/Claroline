<?php

namespace Claroline\AnnouncementBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;

class AnnouncementPdf extends PdfComponent
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
        ];
    }
}
