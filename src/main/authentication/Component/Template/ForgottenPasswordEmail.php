<?php

namespace Claroline\AuthenticationBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class ForgottenPasswordEmail extends EmailComponent
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
            'email',
            'password_reset_link',
        ];
    }

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Resetting your password',
                $this->twig->render('@ClarolineAuthentication/template/forgotten_password.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Réinitialisation de votre mot de passe',
                $this->twig->render('@ClarolineAuthentication/template/forgotten_password.fr.html.twig')
            );
    }
}
