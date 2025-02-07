<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\ItemType\BooleanQuestion;
use UJM\ExoBundle\Library\Attempt\AnswerPartInterface;

#[ORM\Table(name: 'ujm_boolean_choice')]
#[ORM\Entity]
class BooleanChoice extends AbstractChoice implements AnswerPartInterface
{
    #[ORM\JoinColumn(name: 'boolean_question_id', referencedColumnName: 'id')]
    #[ORM\ManyToOne(targetEntity: BooleanQuestion::class, inversedBy: 'choices')]
    private ?BooleanQuestion $question = null;

    public function getQuestion(): ?BooleanQuestion
    {
        return $this->question;
    }

    public function setQuestion(BooleanQuestion $question): void
    {
        $this->question = $question;
    }
}
