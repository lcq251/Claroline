<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Item\Type;

use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;
use UJM\ExoBundle\Validator\JsonSchema\Misc\KeywordValidator;

class WordsQuestionValidator extends JsonSchemaValidator
{
    public function __construct(
        private readonly KeywordValidator $keywordValidator
    ) {
    }

    public function getJsonSchemaUri(): string
    {
        return 'question/words.json';
    }

    public function validateAfterSchema(mixed $data, array $options = []): array
    {
        $errors = [];

        if (in_array(Validation::REQUIRE_SOLUTIONS, $options)) {
            $errors = $this->validateSolutions($data);
        }

        return $errors;
    }

    /**
     * Validates the solution of the question.
     * Sends the keywords collection to the keyword validator.
     */
    private function validateSolutions(array $question): array
    {
        return $this->keywordValidator->validateCollection($question['solutions'], [Validation::NO_SCHEMA, Validation::VALIDATE_SCORE]);
    }
}
