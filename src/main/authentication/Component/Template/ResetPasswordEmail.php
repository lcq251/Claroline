<?php

namespace Claroline\AuthenticationBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

class ResetPasswordEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'password_initialization';
    }

    public function getPlaceholders(): array
    {
        return [
            'first_name',
            'last_name',
            'username',
            'password_initialization_link',
        ];
    }
}
