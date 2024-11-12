<?php

namespace Claroline\AuthenticationBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

class ForgottenPasswordEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'forgotten_password';
    }

    public function getPlaceholders(): array
    {
        return [
            'first_name',
            'last_name',
            'username',
            'password_reset_link',
        ];
    }
}
