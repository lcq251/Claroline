<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData;

use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class OpenAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'answer-data/open.json';
    }

    public function validateAfterSchema(mixed $data, array $options = []): array
    {
        // Checks the content type of the answer match the content type of the question

        return [];
    }
}
