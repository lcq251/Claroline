<?php

namespace UJM\ExoBundle\Entity\Attempt;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Repository\AnswerRepository;

/**
 * An answer represents a user answer to a question.
 */
#[ORM\Table(name: 'ujm_response')]
#[ORM\Entity(repositoryClass: AnswerRepository::class)]
class Answer
{
    use Id;
    use Uuid;

    #[ORM\Column]
    private ?string $ip = null;

    /**
     * The score obtained for this question.
     */
    #[ORM\Column(name: 'mark', type: Types::FLOAT, nullable: true)]
    private ?float $score = null;

    /**
     * A custom feedback sets by a creator.
     */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private string $feedback = '';

    #[ORM\Column(name: 'nb_tries', type: Types::INTEGER)]
    private int $tries = 0;

    /**
     * The answer data formatted in string for DB storage.
     */
    #[ORM\Column(name: 'response', type: Types::TEXT, nullable: true)]
    private ?string $data = null;

    /**
     * The list of hints used to answer the question.
     */
    #[ORM\Column(name: 'used_hints', type: Types::SIMPLE_ARRAY, nullable: true)]
    private array $usedHints = [];

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Paper::class, inversedBy: 'answers')]
    private ?Paper $paper = null;

    /**
     * The id of the question that is answered.
     */
    #[ORM\Column(name: 'question_id', type: Types::STRING, length: 36)]
    private ?string $questionId = null;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function setIp(string $ip): void
    {
        $this->ip = $ip;
    }

    public function getIp(): ?string
    {
        return $this->ip;
    }

    public function setScore(?float $score): void
    {
        $this->score = $score;
    }

    public function getScore(): ?float
    {
        return $this->score;
    }

    public function setFeedback(?string $feedback): void
    {
        $this->feedback = $feedback;
    }

    public function getFeedback(): string
    {
        if (!$this->feedback) {
            return '';
        }

        return $this->feedback;
    }

    public function setTries(int $tries): void
    {
        $this->tries = $tries;
    }

    public function getTries(): int
    {
        return $this->tries;
    }

    public function setData(?string $data): void
    {
        $this->data = $data;
    }

    public function getData(): ?string
    {
        return $this->data;
    }

    public function getUsedHints(): ?array
    {
        return $this->usedHints;
    }

    public function addUsedHint(string $hintId): void
    {
        if (!in_array($hintId, $this->usedHints)) {
            $this->usedHints[] = $hintId;
        }
    }

    public function removeUsedHint(string $hintId): void
    {
        $pos = array_search($hintId, $this->usedHints);
        if (false !== $pos) {
            array_splice($this->usedHints, $pos, 1);
        }
    }

    public function setPaper(Paper $paper): void
    {
        $this->paper = $paper;
    }

    public function getPaper(): ?Paper
    {
        return $this->paper;
    }

    public function getQuestionId(): ?string
    {
        return $this->questionId;
    }

    public function setQuestionId(string $questionId): void
    {
        $this->questionId = $questionId;
    }
}
