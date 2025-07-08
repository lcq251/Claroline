<?php

namespace Claroline\CoreBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class UserRegistrationEmail extends EmailComponent
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

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Registration to %platform_name%',
                $this->twig->render('@ClarolineCore/template/user_registration.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Inscription à %platform_name%',
                $this->twig->render('@ClarolineCore/template/user_registration.fr.html.twig')
            );
    }
}
