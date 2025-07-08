<?php

namespace Claroline\CoreBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class UserActivationEmail extends EmailComponent
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

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Activate your %platform_name% account',
                $this->twig->render('@ClarolineCore/template/user_activation.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Activation de votre compte %platform_name%',
                $this->twig->render('@ClarolineCore/template/user_activation.fr.html.twig')
            );
    }
}
