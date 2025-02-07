<?php

namespace UJM\ExoBundle\Serializer\Item\Type;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use UJM\ExoBundle\Entity\ItemType\BooleanQuestion;
use UJM\ExoBundle\Entity\Misc\BooleanChoice;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Serializer\Content\ContentSerializer;

class BooleanQuestionSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly ContentSerializer $contentSerializer
    ) {
    }

    public function getName(): string
    {
        return 'exo_question_boolean';
    }

    /**
     * Converts a Boolean question into a JSON-encodable structure.
     */
    public function serialize(BooleanQuestion $question, array $options = []): array
    {
        // Serializes choices
        $choices = $this->serializeChoices($question, $options);

        if (in_array(Transfer::SHUFFLE_ANSWERS, $options)) {
            shuffle($choices);
        }

        $serialized = ['choices' => $choices];

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $serialized['solutions'] = $this->serializeSolutions($question);
        }

        return $serialized;
    }

    public function deserialize(array $data, BooleanQuestion $question = null, array $options = []): BooleanQuestion
    {
        if (empty($question)) {
            $question = new BooleanQuestion();
        }

        $this->deserializeChoices($question, $data['choices'], $data['solutions'], $options);

        return $question;
    }

    private function serializeChoices(BooleanQuestion $question, array $options = []): array
    {
        return array_map(function (BooleanChoice $choice) use ($options) {
            $choiceData = $this->contentSerializer->serialize($choice, $options);
            $choiceData['id'] = $choice->getUuid();

            return $choiceData;
        }, $question->getChoices()->toArray());
    }

    private function deserializeChoices(BooleanQuestion $question, array $choices, array $solutions, array $options = []): void
    {
        $choiceEntities = $question->getChoices()->toArray();

        foreach ($choices as $choiceData) {
            $choice = null;

            // Searches for an existing choice entity.
            foreach ($choiceEntities as $entityIndex => $entityChoice) {
                /** @var BooleanChoice $entityChoice */
                if ($entityChoice->getUuid() === $choiceData['id']) {
                    $choice = $entityChoice;
                    unset($choiceEntities[$entityIndex]);
                    break;
                }
            }

            $choice = $choice ?: new BooleanChoice();
            $choice->setUuid($choiceData['id']);

            // Deserialize choice content
            $choice = $this->contentSerializer->deserialize($choiceData, $choice, $options);

            // Set choice score and feedback
            $choice->setScore(0);

            foreach ($solutions as $solution) {
                if ($solution['id'] === $choiceData['id']) {
                    $choice->setScore($solution['score']);

                    if (isset($solution['feedback'])) {
                        $choice->setFeedback($solution['feedback']);
                    }

                    break;
                }
            }

            $question->addChoice($choice);
        }

        // Remaining choices are no longer in the Question
        foreach ($choiceEntities as $choiceToRemove) {
            $question->removeChoice($choiceToRemove);
        }
    }

    private function serializeSolutions(BooleanQuestion $question): array
    {
        return array_map(function (BooleanChoice $choice) {
            $solutionData = [
                'id' => $choice->getUuid(),
                'score' => $choice->getScore(),
            ];

            if ($choice->getFeedback()) {
                $solutionData['feedback'] = $choice->getFeedback();
            }

            return $solutionData;
        }, $question->getChoices()->toArray());
    }
}
