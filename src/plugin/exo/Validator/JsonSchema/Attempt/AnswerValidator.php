<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Attempt;

use Claroline\AppBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Item\Item;
use UJM\ExoBundle\Library\Item\ItemDefinitionsCollection;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

class AnswerValidator extends JsonSchemaValidator
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly ItemDefinitionsCollection $itemDefinitions
    ) {
    }

    public function getJsonSchemaUri(): string
    {
        return 'answer.json';
    }

    public function validateAfterSchema(mixed $answer, array $options = []): array
    {
        $errors = [];

        if (empty($options[Validation::QUESTION])) {
            $question = $this->om->getRepository(Item::class)->findOneBy([
                'uuid' => $answer->questionId,
            ]);

            $options[Validation::QUESTION] = $question->getInteraction();
        }

        if (empty($options[Validation::QUESTION])) {
            $errors[] = [
                'path' => '/questionId',
                'message' => 'question does not exist',
            ];
        } elseif (!empty($answer['data']) && $this->itemDefinitions->isQuestionType($options[Validation::QUESTION]->getQuestion()->getMimeType())) {
            // Forward to item type validator
            $definition = $this->itemDefinitions->get($options[Validation::QUESTION]->getQuestion()->getMimeType());
            $errors = array_merge(
                $errors,
                $definition->validateAnswer($answer['data'], $options[Validation::QUESTION], array_merge($options, [Validation::NO_SCHEMA]))
            );
        }

        return $errors;
    }
}
