<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Item\Type;

use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;
use UJM\ExoBundle\Validator\JsonSchema\Misc\KeywordValidator;

class GridQuestionValidator extends JsonSchemaValidator
{
    public function __construct(
        private readonly KeywordValidator $keywordValidator
    ) {
    }

    public function getJsonSchemaUri(): string
    {
        return 'question/grid.json';
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
     */
    private function validateSolutions(array $question): array
    {
        $errors = [];

        // check solution IDs are consistent with cells IDs
        $cellIds = array_map(function (array $cell) {
            return $cell['id'];
        }, $question['cells']);

        foreach ($question['solutions'] as $index => $solution) {
            if (!in_array($solution['cellId'], $cellIds)) {
                $errors[] = [
                    'path' => "/solutions[{$index}]",
                    'message' => "id {$solution['cellId']} doesn't match any cell id",
                ];
            }
            // Validates cell choices
            $errors = array_merge(
                $errors,
                $this->keywordValidator->validateCollection($solution['answers'], [Validation::NO_SCHEMA, Validation::VALIDATE_SCORE])
            );
        }

        return $errors;
    }
}
