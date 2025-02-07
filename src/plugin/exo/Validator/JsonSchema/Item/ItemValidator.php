<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Item;

use UJM\ExoBundle\Library\Item\ItemDefinitionsCollection;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;
use UJM\ExoBundle\Validator\JsonSchema\Content\ContentValidator;

class ItemValidator extends JsonSchemaValidator
{
    public function __construct(
        private readonly ItemDefinitionsCollection $itemDefinitions,
        private readonly HintValidator $hintValidator,
        private readonly ContentValidator $contentValidator
    ) {
    }

    public function getJsonSchemaUri(): string
    {
        return 'question/base.json';
    }

    /**
     * Delegates the validation to the correct question type handler.
     */
    public function validateAfterSchema(mixed $question, array $options = []): array
    {
        $errors = [];

        if (empty($question['content'])) {
            // No blank content
            $errors[] = [
                'path' => '/content',
                'message' => 'Question content can not be empty',
            ];
        }

        if (!isset($question['score'])) {
            // No question with no score
            // this is not in the schema because this will become optional when exercise without scores will be implemented
            $errors[] = [
                'path' => '/score',
                'message' => 'Question score is required',
            ];
        }

        if (in_array(Validation::REQUIRE_SOLUTIONS, $options) && !isset($question['solutions'])) {
            // No question without solutions
            $errors[] = [
                'path' => '/solutions',
                'message' => 'Question requires a "solutions" property',
            ];
        }

        if (!$this->itemDefinitions->has($question['type'])) {
            $errors[] = [
                'path' => '/type',
                'message' => 'Unknown question type "'.$question['type'].'"',
            ];
        }

        // Validate hints
        if (isset($question['hints'])) {
            array_map(function ($hint) use (&$errors, $options): void {
                $errors = array_merge($errors, $this->hintValidator->validateAfterSchema($hint, $options));
            }, $question['hints']);
        }

        // Validate objects
        if (isset($question['objects'])) {
            array_map(function ($object) use (&$errors, $options): void {
                $errors = array_merge($errors, $this->contentValidator->validateAfterSchema($object, $options));
            }, $question['objects']);
        }

        // Validates specific data of the question type
        if (empty($errors)) {
            // Forward to the correct definition
            $definition = $this->itemDefinitions->get($question['type']);

            $errors = array_merge(
                $errors,
                $definition->validateQuestion($question, array_merge($options, [Validation::NO_SCHEMA]))
            );
        }

        return $errors;
    }
}
