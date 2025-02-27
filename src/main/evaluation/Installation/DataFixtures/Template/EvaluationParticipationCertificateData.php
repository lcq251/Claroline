<?php

namespace Claroline\EvaluationBundle\Installation\DataFixtures\Template;

use Claroline\CoreBundle\Installation\DataFixtures\AbstractTemplateFixture;

class EvaluationParticipationCertificateData extends AbstractTemplateFixture
{
    protected static function getTemplateType(): string
    {
        return 'evaluation_participation_certificate';
    }

    protected function getSystemTemplates(): array
    {
        return [
            'Claroline Connect' => [
                'en' => [
                    'title' => 'Certificate of participation in "%evaluated_content_name%"',
                    'content' => $this->twig->render('@ClarolineEvaluation/template/evaluation_participation_certificate.en.pdf.twig'),
                ],
                'fr' => [
                    'title' => 'Certificat de participation à "%evaluated_content_name%"',
                    'content' => $this->twig->render('@ClarolineEvaluation/template/evaluation_participation_certificate.fr.pdf.twig'),
                ],
            ],
        ];
    }
}
