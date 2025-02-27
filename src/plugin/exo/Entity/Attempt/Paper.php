<?php

namespace UJM\ExoBundle\Entity\Attempt;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Repository\PaperRepository;

/**
 * A paper represents a user attempt to a quiz.
 */
#[ORM\Table(name: 'ujm_paper')]
#[ORM\Entity(repositoryClass: PaperRepository::class)]
class Paper
{
    use Id;
    use Uuid;

    #[ORM\Column(name: 'num_paper', type: Types::INTEGER)]
    private int $number = 1;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $start = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $end = null;

    /**
     * The generated structure (steps and questions) for the attempt.
     */
    #[ORM\Column(name: 'ordre_question', type: Types::TEXT, nullable: true)]
    private ?string $structure = null;

    /**
     * Used to store temp decoded structure to avoid decoding many times in the same life cycle.
     */
    private ?array $decodedStructure;

    #[ORM\Column(name: 'interupt', type: Types::BOOLEAN, nullable: true)]
    private bool $interrupted = true;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $score = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $total = null;

    /**
     * Anonymize the user information when showing the paper.
     */
    #[ORM\Column(name: 'anonymous', type: Types::BOOLEAN, nullable: true)]
    private bool $anonymized = false;

    /**
     * A paper is invalidated when the exercise definition has changed.
     */
    #[ORM\Column(name: 'invalidated', type: Types::BOOLEAN)]
    private bool $invalidated = false;

    /**
     * The user who made the attempt.
     * If this is the attempt for an anonymous user, this property is `null`.
     */
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $user = null;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Exercise::class)]
    private ?Exercise $exercise = null;

    /**
     * The submitted answers for this attempt.
     *
     * @var Collection<int, Answer>
     */
    #[ORM\OneToMany(targetEntity: Answer::class, mappedBy: 'paper', cascade: ['all'], orphanRemoval: true)]
    private Collection $answers;

    public function __construct()
    {
        $this->refreshUuid();

        $this->start = new \DateTime();
        $this->answers = new ArrayCollection();
    }

    public function setNumber(int $number): void
    {
        $this->number = $number;
    }

    public function getNumber(): int
    {
        return $this->number;
    }

    public function setStart(?\DateTimeInterface $start = null): void
    {
        $this->start = $start;
    }

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setEnd(?\DateTimeInterface $end = null): void
    {
        $this->end = $end;
    }

    public function getEnd(): ?\DateTimeInterface
    {
        return $this->end;
    }

    public function setStructure(string $structure): void
    {
        $this->structure = $structure;

        // reset stored decoded structure
        $this->decodedStructure = null;
    }

    public function getStructure(bool $decoded = false): string|array
    {
        if ($decoded) {
            return $this->getDecodedStructure();
        }

        return $this->structure;
    }

    public function setInterrupted(bool $interrupted): void
    {
        $this->interrupted = $interrupted;
    }

    public function isInterrupted(): bool
    {
        return $this->interrupted;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user = null): void
    {
        $this->user = $user;
    }

    public function getExercise(): Exercise
    {
        return $this->exercise;
    }

    public function setExercise(Exercise $exercise): void
    {
        $this->exercise = $exercise;
    }

    public function setScore(?float $score): void
    {
        $this->score = $score;
    }

    public function getScore(): ?float
    {
        return $this->score;
    }

    public function setTotal(?float $total): void
    {
        $this->total = $total;
    }

    public function getTotal(): ?float
    {
        return $this->total;
    }

    public function setAnonymized(bool $anonymized): void
    {
        $this->anonymized = $anonymized;
    }

    public function isAnonymized(): bool
    {
        return $this->anonymized;
    }

    public function setInvalidated(bool $invalidated): void
    {
        $this->invalidated = $invalidated;
    }

    public function isInvalidated(): bool
    {
        return $this->invalidated;
    }

    /**
     * Gets answers.
     *
     * @return Answer[]|ArrayCollection
     */
    public function getAnswers()
    {
        return $this->answers;
    }

    /**
     * Gets a question in the paper structure.
     */
    public function getQuestion($questionUuid): ?array
    {
        $question = null;

        $decoded = $this->getDecodedStructure();
        foreach ($decoded['steps'] as $step) {
            foreach ($step['items'] as $item) {
                if ($item['id'] === $questionUuid) {
                    $question = $item;
                    break 2;
                }
            }
        }

        return $question;
    }

    /**
     * Get all the hints available in the paper structure.
     *
     * @return array
     */
    public function getHints(): array
    {
        $hints = [];

        $decoded = $this->getDecodedStructure();
        foreach ($decoded['steps'] as $step) {
            foreach ($step['items'] as $item) {
                if (1 === preg_match('#^application\/x\.[^/]+\+json$#', $item['type'])) {
                    foreach ($item['hints'] as $hint) {
                        $hints[$hint['id']] = $hint;
                    }
                }
            }
        }

        return $hints;
    }

    /**
     * Gets the answer to a question if any exist.
     *
     * @param string $questionUuid
     *
     * @return Answer
     */
    public function getAnswer($questionUuid)
    {
        $found = null;
        foreach ($this->answers as $answer) {
            if ($answer->getQuestionId() === $questionUuid) {
                $found = $answer;
                break;
            }
        }

        return $found;
    }

    /**
     * Adds an answer.
     */
    public function addAnswer(Answer $answer)
    {
        if (!$this->answers->contains($answer)) {
            $this->answers->add($answer);
            $answer->setPaper($this);
        }
    }

    /**
     * Removes an answer.
     */
    public function removeAnswer(Answer $answer)
    {
        if ($this->answers->contains($answer)) {
            $this->answers->removeElement($answer);
        }
    }

    private function getDecodedStructure()
    {
        if (empty($this->decodedStructure)) {
            $this->decodeStructure();
        }

        return $this->decodedStructure;
    }

    private function decodeStructure()
    {
        $this->decodedStructure = json_decode($this->structure, true);
    }
}
