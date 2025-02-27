<?php

namespace Claroline\TemplateBundle\Component\Template;

/**
 * Definition for a generic templates.
 * Usually used for templates directly rendered in the Claroline client (e.g. terms of services).
 */
abstract class TemplateComponent implements TemplateInterface
{
    public static function getType(): string
    {
        return TemplateInterface::OTHER;
    }

    public function getPlaceholders(): array
    {
        return [];
    }

    public function getSamples(): array
    {
        return [];
    }
}
