<?php

namespace Claroline\TemplateBundle\Component\Template;

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

    public static function getSamples(): array
    {
        return [];
    }
}
