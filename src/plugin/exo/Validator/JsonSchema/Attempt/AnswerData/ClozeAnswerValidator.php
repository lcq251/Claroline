<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData;

use UJM\ExoBundle\Entity\ItemType\ClozeQuestion;
use UJM\ExoBundle\Entity\Misc\Hole;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class ClozeAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri(): string
    {
        return 'answer-data/cloze.json';
    }

    public function validateAfterSchema(mixed $answerData, array $options = []): array
    {
        /** @var ClozeQuestion $question */
        $question = !empty($options[Validation::QUESTION]) ? $options[Validation::QUESTION] : null;

        if (empty($question)) {
            throw new \LogicException('Answer validation : Cannot perform additional validation without question.');
        }

        $holeIds = array_map(function (Hole $hole) {
            return $hole->getUuid();
        }, $question->getHoles()->toArray());

        foreach ($answerData as $answer) {
            if (empty($answer['holeId'])) {
                return ['Answer `holeId` cannot be empty'];
            }

            if (!in_array($answer['holeId'], $holeIds)) {
                return ['Answer array identifiers must reference question holes'];
            }
        }

        return [];
    }
}
