<?php

namespace Claroline\PrivacyBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\TemplateComponent;

class PrivacyTemplate extends TemplateComponent
{
    public static function getName(): string
    {
        return 'privacy';
    }

    public function getPlaceholders(): array
    {
        return [
            'country_storage',
            'dpo_name',
            'dpo_email',
            'dpo_phone',
            'dpo_address_street1',
            'dpo_address_street2',
            'dpo_address_postal_code',
            'dpo_address_city',
            'dpo_address_state',
            'dpo_address_country',
        ];
    }
}
