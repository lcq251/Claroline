<?php

namespace UJM\ExoBundle\Library\Options;

/**
 * Defines the different types of Exercises.
 */
final class ExerciseType
{
    /**
     * @var string
     */
    public const CONCEPTUALIZATION = 'conceptualization';

    /**
     * @var string
     */
    public const FORMATIVE = 'formative';

    /**
     * @var string
     */
    public const SUMMATIVE = 'summative';

    /**
     * @var string
     */
    public const CERTIFICATION = 'evaluative';

    /**
     * @var string
     *
     * @deprecated no replacement
     */
    public const SURVEY = 'survey';

    /**
     * @var string
     */
    public const CUSTOM = 'custom';
}
