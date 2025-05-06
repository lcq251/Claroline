<?php

namespace Claroline\CoreBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

class UserActivationEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'user_activation';
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
