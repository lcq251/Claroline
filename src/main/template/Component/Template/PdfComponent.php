<?php

namespace Claroline\TemplateBundle\Component\Template;

use Claroline\TemplateBundle\Model\TemplateInterface;
use Twig\Environment;

abstract class PdfComponent implements TemplateTypeInterface
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
        return TemplateTypeInterface::PDF;
    }

    public function getPlaceholders(): array
    {
        return [];
    }

    public function getSamples(): array
    {
        return [];
    }

    public function getSystemTemplate(): TemplateInterface
    {
        return [];
    }
}
