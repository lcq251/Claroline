<?php

namespace Claroline\AuthenticationBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

class DisabledPasswordEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'user_disabled';
    }

    public function getPlaceholders(): array
    {
        return [
            'first_name',
            'last_name',
            'username',
        ];
    }
}
