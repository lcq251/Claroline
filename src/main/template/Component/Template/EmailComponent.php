<?php

namespace Claroline\TemplateBundle\Component\Template;

use Twig\Environment;

abstract class EmailComponent implements TemplateTypeInterface
{
    protected Environment $twig;

    /**
     * @internal used by DI
     */
    public function setTwig(Environment $twig): void
    {
        $this->twig = $twig;
    }

    public static function getType(): string
    {
        return TemplateTypeInterface::EMAIL;
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
