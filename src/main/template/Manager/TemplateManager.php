<?php

namespace Claroline\TemplateBundle\Manager;

use Claroline\CoreBundle\Manager\Template\PlaceholderManager;

class TemplateManager
{
    public function __construct(
        private readonly PlaceholderManager $placeholderManager
    ) {
    }
}
