<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Item\Type;

use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class GraphicQuestionValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'question/graphic.json';
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
     *  - There is at least one solution with a positive score.
     */
    private function validateSolutions(array $question): array
    {
        $errors = [];

        $maxScore = -1;
        foreach ($question['solutions'] as $solution) {
            if ($solution['score'] > $maxScore) {
                $maxScore = $solution['score'];
            }
        }

        // check there is a positive score solution
        if ($maxScore <= 0) {
            $errors[] = [
                'path' => '/solutions',
                'message' => 'There is no solution with a positive score',
            ];
        }

        return $errors;
    }
}
