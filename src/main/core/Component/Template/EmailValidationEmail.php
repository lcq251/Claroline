<?php

namespace Claroline\CoreBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class EmailValidationEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'user_email_validation';
    }

    public function getPlaceholders(): array
    {
        return [
            'first_name',
            'last_name',
            'username',
            'validation_mail',
        ];
    }

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Email validation for %platform_name%',
                $this->twig->render('@ClarolineCore/template/user_email_validation.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Validation de l\'adresse email pour %platform_name%',
                $this->twig->render('@ClarolineCore/template/user_email_validation.fr.html.twig')
            );
    }
}
