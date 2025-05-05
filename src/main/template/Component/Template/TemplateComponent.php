<?php

namespace Claroline\TemplateBundle\Component\Template;

use Claroline\TemplateBundle\Model\TemplateInterface;
use Twig\Environment;

/**
 * Definition for a generic templates.
 * Usually used for templates directly rendered in the Claroline client (e.g. terms of services).
 */
abstract class TemplateComponent implements TemplateTypeInterface
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
        return TemplateTypeInterface::OTHER;
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
        //return [];
    }
}
