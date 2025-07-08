<?php

namespace Claroline\AuthenticationBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class DisabledPasswordEmail extends EmailComponent
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

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Your %platform_name% account is disabled',
                $this->twig->render('@ClarolineAuthentication/template/user_disabled.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Votre compte %platform_name% est désactivé',
                $this->twig->render('@ClarolineAuthentication/template/user_disabled.fr.html.twig')
            );
    }
}
