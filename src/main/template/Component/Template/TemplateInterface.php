<?php

namespace Claroline\TemplateBundle\Component\Template;

use Claroline\AppBundle\Component\ComponentInterface;

interface TemplateInterface extends ComponentInterface
{
    public const EMAIL = 'email';
    public const PDF = 'pdf';
    public const OTHER = 'other';

    public static function getType(): string;

    public function getPlaceholders(): array;

    public function getSamples(): array;
}
