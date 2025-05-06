<?php

namespace Claroline\CoreBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

class UserRegistrationEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'user_registration';
    }

    public function getPlaceholders(): array
    {
        return [
            'first_name',
            'last_name',
            'username',
            'email',
            'user_activation_link',
        ];
    }
}
