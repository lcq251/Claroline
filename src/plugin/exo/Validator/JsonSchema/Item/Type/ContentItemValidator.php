<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Item\Type;

use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class ContentItemValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'content.json';
    }

    public function validateAfterSchema(mixed $data, array $options = []): array
    {
        return [];
    }
}
