<?php

namespace Claroline\AuthenticationBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class ResetPasswordEmail extends EmailComponent
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
            'email',
            'password_initialization_link',
        ];
    }

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Password initialization',
                $this->twig->render('@ClarolineAuthentication/template/password_initialization.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Initialisation du mot de passe',
                $this->twig->render('@ClarolineAuthentication/template/password_initialization.fr.html.twig')
            );
    }
}
