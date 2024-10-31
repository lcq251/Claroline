<?php

namespace Claroline\PrivacyBundle\Installation\DataFixtures\Template;

use Claroline\CoreBundle\Installation\DataFixtures\AbstractTemplateFixture;

class PrivacyData extends AbstractTemplateFixture
{
    protected static function getTemplateType(): string
    {
        return 'privacy';
    }

    protected function getSystemTemplates(): array
    {
        return [
            'Claroline Connect' => [
                'en' => [
                    'title' => 'Privacy Policy',
                    'content' => $this->twig->render('@ClarolinePrivacy/template/privacy.en.html.twig'),
                ],
                'fr' => [
                    'title' => 'Politique de confidentialité',
                    'content' => $this->twig->render('@ClarolinePrivacy/template/privacy.fr.html.twig'),
                ],
            ],
        ];
    }
}
