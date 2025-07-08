<?php

namespace Claroline\PrivacyBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\TemplateComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class TermsOfServiceTemplate extends TemplateComponent
{
    public static function getName(): string
    {
        return 'terms_of_service';
    }

    public function getPlaceholders(): array
    {
        return [];
    }

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                'Terms of Service',
                $this->twig->render('@ClarolinePrivacy/template/terms_of_service.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                'Conditions d\'utilisation',
                $this->twig->render('@ClarolinePrivacy/template/terms_of_service.fr.html.twig')
            );
    }
}
