<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Item\Type;

use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class OpenQuestionValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'question/open.json';
    }

    public function validateAfterSchema(mixed $data, array $options = []): array
    {
        return [];
    }
}
