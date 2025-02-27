<?php

namespace Claroline\EvaluationBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;

/**
 * @deprecated use EvaluationSuccessCertificatePdf
 */
class WorkspaceSuccessCertificatePdf extends PdfComponent
{
    public static function getName(): string
    {
        return 'workspace_success_certificate';
    }

    public function getPlaceholders(): array
    {
        return [
            'workspace_name',
            'workspace_code',
            'workspace_description',
            'workspace_poster',
            'user_first_name',
            'user_last_name',
            'user_username',
            'evaluation_duration',
            'evaluation_status',
            'evaluation_datetime',
            'evaluation_date',
            'evaluation_time',
            'evaluation_score',
            'evaluation_score_max',
        ];
    }
}
