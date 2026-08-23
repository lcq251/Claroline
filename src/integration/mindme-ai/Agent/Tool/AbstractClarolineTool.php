<?php

namespace Claroline\MindMeAiBundle\Agent\Tool;

use NeuronAI\Tools\Tool;

/**
 * Base class for all Claroline AI tools.
 *
 * Subclasses define their contract via name/description (constructor) and a
 * list of ToolProperty in properties(), then implement __invoke() with the
 * same arguments (in the same order) as the declared properties.
 */
abstract class AbstractClarolineTool extends Tool
{
    public function __construct(string $name, string $description)
    {
        parent::__construct($name, $description);
    }
}
