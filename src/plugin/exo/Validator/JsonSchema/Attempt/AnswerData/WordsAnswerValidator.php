<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData;

use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class WordsAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'answer-data/words.json';
    }

    public function validateAfterSchema(mixed $data, array $options = []): array
    {
        return [];
    }
}
