<?php

namespace UJM\ExoBundle\Library\Options;

/**
 * Defines the recurrence of an action.
 */
final class Recurrence
{
    /**
     * The action is never executed.
     *
     * @var string
     */
    public const NEVER = 'never';

    /**
     * The action is executed one time.
     *
     * @var string
     */
    public const ONCE = 'once';

    /**
     * The action is executed each time.
     *
     * @var string
     */
    public const ALWAYS = 'always';
}
