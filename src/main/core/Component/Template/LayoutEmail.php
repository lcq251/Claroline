<?php

namespace Claroline\CoreBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;

class LayoutEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'email_layout';
    }

    public function getPlaceholders(): array
    {
        return [
            'content',
            'sender_username',
            'sender_first_name',
            'sender_last_name',
            'sender_email',
            'sender_avatar',
        ];
    }
}
