<?php

namespace Claroline\EvaluationBundle\Library;

final class EvaluationOptions
{
    /**
     * Define the number of decimal for the score value.
     * NB. we store raw value, it is rounded when returned in the API.
     */
    public const SCORE_PRECISION = 1;

    /**
     * Define the number of decimal for the progression value.
     * NB. we store raw value, it is rounded when returned in the API.
     */
    public const PROGRESSION_PRECISION = 0;
}
