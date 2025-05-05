<?php

namespace Claroline\CoreBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

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

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'New message from %platform_name%',
                $this->twig->render('@ClarolineCore/template/email_layout.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Nouveau message de %platform_name%',
                $this->twig->render('@ClarolineCore/template/email_layout.fr.html.twig')
            );
    }
}
