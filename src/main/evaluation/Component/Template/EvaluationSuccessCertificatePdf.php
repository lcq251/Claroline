<?php

namespace Claroline\EvaluationBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\PdfComponent;

class EvaluationSuccessCertificatePdf extends PdfComponent
{
    public static function getName(): string
    {
        return 'evaluation_success_certificate';
    }

    public function getPlaceholders(): array
    {
        return [
            'evaluated_content_name',
            'evaluated_content_code',
            'evaluated_content_description',
            'evaluated_content_poster',

            'user_first_name',
            'user_last_name',
            'user_username',

            'evaluation_duration',
            'evaluation_status',

            'evaluation_last_activity_datetime_utc',
            'evaluation_last_activity_date_utc',
            'evaluation_last_activity_time_utc',
            'evaluation_last_activity_datetime',
            'evaluation_last_activity_date',
            'evaluation_last_activity_time',

            'evaluation_start_datetime_utc',
            'evaluation_start_date_utc',
            'evaluation_start_time_utc',
            'evaluation_start_datetime',
            'evaluation_start_date',
            'evaluation_start_time',

            'evaluation_end_datetime_utc',
            'evaluation_end_date_utc',
            'evaluation_end_time_utc',
            'evaluation_end_datetime',
            'evaluation_end_date',
            'evaluation_end_time',

            'evaluation_score',
            'evaluation_score_max',
        ];
    }
}
