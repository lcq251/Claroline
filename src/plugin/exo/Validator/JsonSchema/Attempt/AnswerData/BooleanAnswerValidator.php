<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData;

use UJM\ExoBundle\Entity\ItemType\ChoiceQuestion;
use UJM\ExoBundle\Entity\Misc\BooleanChoice;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class BooleanAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'answer-data/boolean.json';
    }

    public function validateAfterSchema(mixed $answerData, array $options = []): array
    {
        $errors = [];

        /** @var ChoiceQuestion $question */
        $question = !empty($options[Validation::QUESTION]) ? $options[Validation::QUESTION] : null;
        if (empty($question)) {
            throw new \LogicException('Answer validation : Cannot perform additional validation without question.');
        }

        $choiceIds = array_map(function (BooleanChoice $choice) {
            return $choice->getUuid();
        }, $question->getChoices()->toArray());

        if (!in_array($answerData, $choiceIds)) {
            $errors[] = [
                'path' => '/',
                'message' => 'Answer identifiers must reference question choices',
            ];
        }

        return $errors;
    }
}
