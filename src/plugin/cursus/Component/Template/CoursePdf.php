<?php

namespace Claroline\CursusBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;

class CoursePdf extends PdfComponent
{
    public static function getName(): string
    {
        return 'training_course';
    }

    public function getPlaceholders(): array
    {
        return [
            'course_name',
            'course_code',
            'course_description',
            'course_poster',
            'course_default_duration',
            'course_public_registration',
        ];
    }
}
