<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData;

use UJM\ExoBundle\Entity\ItemType\GridQuestion;
use UJM\ExoBundle\Entity\Misc\Cell;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class GridAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'answer-data/grid.json';
    }

    public function validateAfterSchema(mixed $answerData, array $options = []): array
    {
        /** @var GridQuestion $question */
        $question = !empty($options[Validation::QUESTION]) ? $options[Validation::QUESTION] : null;
        if (empty($question)) {
            throw new \LogicException('Answer validation : Cannot perform additional validation without question.');
        }

        $cellIds = array_map(function (Cell $cell) {
            return $cell->getUuid();
        }, $question->getCells()->toArray());

        foreach ($answerData as $answer) {
            if (empty($answer['cellId'])) {
                return ['Answer `cellId` cannot be empty'];
            }

            if (!in_array($answer['cellId'], $cellIds)) {
                return ['Answer array identifiers must reference question cells'];
            }
        }

        return [];
    }
}
