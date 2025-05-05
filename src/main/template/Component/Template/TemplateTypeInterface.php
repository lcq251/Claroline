<?php

namespace Claroline\TemplateBundle\Component\Template;

use Claroline\AppBundle\Component\ComponentInterface;
use Claroline\TemplateBundle\Model\TemplateInterface;

interface TemplateTypeInterface extends ComponentInterface
{
    public const EMAIL = 'email';
    public const PDF = 'pdf';
    public const OTHER = 'other';

    /**
     * Get the unique name of the template component.
     */
    public static function getType(): string;

    /**
     * Get the list of placeholders available.
     * Placeholders are replaced with the provided values at compile time.
     */
    public function getPlaceholders(): array;

    /**
     * Gets the list of example values for the available placeholders.
     * Each key in the returned array is the name of the placeholder.
     */
    public function getSamples(): array;

    /**
     * Get the template to use if no custom one is defined for the template type.
     */
    public function getSystemTemplate(): TemplateInterface;
}
