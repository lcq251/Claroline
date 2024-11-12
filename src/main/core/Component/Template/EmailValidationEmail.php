<?php

namespace Claroline\CoreBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

class EmailValidationEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'user_email_validation';
    }

    public function getPlaceholders(): array
    {
        return [
            'first_name',
            'last_name',
            'username',
            'validation_mail',
        ];
    }
}
