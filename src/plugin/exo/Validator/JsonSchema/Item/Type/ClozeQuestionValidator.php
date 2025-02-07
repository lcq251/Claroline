<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Item\Type;

use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;
use UJM\ExoBundle\Validator\JsonSchema\Misc\KeywordValidator;

class ClozeQuestionValidator extends JsonSchemaValidator
{
    public function __construct(
        private readonly KeywordValidator $keywordValidator
    ) {
    }

    public function getJsonSchemaUri(): string
    {
        return 'question/cloze.json';
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
     * Checks :
     *  - The solutions IDs are consistent with holes IDs
     *  - There is at least one solution with a positive score for each Hole.
     */
    private function validateSolutions(array $question): array
    {
        $errors = [];

        // check solution IDs are consistent with hole IDs
        $holeIds = array_map(function (array $hole) {
            return $hole['id'];
        }, $question['holes']);

        if (count($question['holes']) !== count($question['solutions'])) {
            $errors[] = [
                'path' => '/solutions',
                'message' => 'there must be the same number of solutions and holes',
            ];
        }

        foreach ($question['solutions'] as $index => $solution) {
            if (!in_array($solution['holeId'], $holeIds)) {
                $errors[] = [
                    'path' => "/solutions[{$index}]",
                    'message' => "id {$solution['holeId']} doesn't match any hole id",
                ];
            }

            // Validates hole keywords
            $errors = array_merge($errors, $this->keywordValidator->validateCollection($solution['answers'], [Validation::NO_SCHEMA, Validation::VALIDATE_SCORE]));
        }

        return $errors;
    }
}
