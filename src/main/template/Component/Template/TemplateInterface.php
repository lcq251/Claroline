<?php

namespace Claroline\TemplateBundle\Component\Template;

use Claroline\AppBundle\Component\ComponentInterface;

interface TemplateInterface extends ComponentInterface
{
    public function getPlaceholders(): array;
}
