<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Item\Type;

class BooleanQuestionValidator extends ChoiceQuestionValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'question/boolean.json';
    }
}
