<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData;

use UJM\ExoBundle\Entity\ItemType\PairQuestion;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class PairAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'answer-data/pair.json';
    }

    public function validateAfterSchema(mixed $answerData, array $options = []): array
    {
        $errors = [];

        /** @var PairQuestion $question */
        $question = !empty($options[Validation::QUESTION]) ? $options[Validation::QUESTION] : null;
        if (empty($question)) {
            throw new \LogicException('Answer validation : Cannot perform additional validation without question.');
        }

        foreach ($answerData as $rowIndex => $answerRow) {
            foreach ($answerRow as $itemIndex => $answerItem) {
                if (empty($question->getItem($answerItem))) {
                    $errors[] = [
                        'path' => "/[{$rowIndex}]/[{$itemIndex}]",
                        'message' => 'answers must reference a question item',
                    ];
                }
            }
        }

        return $errors;
    }
}
