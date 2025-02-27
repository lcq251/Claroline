<?php

namespace Claroline\TemplateBundle\Component\Template;

abstract class EmailComponent implements TemplateInterface
{
    public static function getType(): string
    {
        return TemplateInterface::EMAIL;
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
