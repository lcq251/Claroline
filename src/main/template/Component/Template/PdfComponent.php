<?php

namespace Claroline\TemplateBundle\Component\Template;

abstract class PdfComponent implements TemplateInterface
{
    public static function getType(): string
    {
        return TemplateInterface::PDF;
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
