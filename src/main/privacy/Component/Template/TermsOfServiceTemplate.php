<?php

namespace Claroline\PrivacyBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\TemplateComponent;

class TermsOfServiceTemplate extends TemplateComponent
{
    public static function getName(): string
    {
        return 'terms_of_service';
    }

    public function getPlaceholders(): array
    {
        return [];
    }
}
