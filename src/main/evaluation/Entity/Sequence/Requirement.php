<?php

namespace Claroline\EvaluationBundle\Entity\Sequence;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * The requirements to fulfill for users to be able to do a sequence.
 */
#[ORM\Entity]
#[ORM\Table(name: 'claro_evaluation_sequence_requirement')]
class Requirement
{
    use Id;
    use Uuid;

    #[ORM\ManyToOne(targetEntity: Sequence::class, inversedBy: 'requirements')]
    #[ORM\JoinColumn(name: 'sequence_id', onDelete: 'CASCADE')]
    private ?Sequence $sequence;

    #[ORM\ManyToOne(targetEntity: Sequence::class)]
    #[ORM\JoinColumn(name: 'required_sequence_id', onDelete: 'CASCADE')]
    private ?Sequence $requiredSequence;

    /**
     * An optional status to obtain in the $requiredSequence to unlock the $sequence.
     */
    private ?string $status = null;

    /**
     * An optional progression to obtain in the $requiredSequence to unlock the $sequence.
     */
    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $progression = null;

    /**
     * An optional minimum score to obtain in the $requiredSequence to unlock the $sequence.
     */
    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $minScore = null;

    /**
     * An optional maximum score to obtain in the $requiredSequence to unlock the $sequence.
     */
    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $maxScore = null;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function getSequence(): ?Sequence
    {
        return $this->sequence;
    }

    public function setSequence(?Sequence $sequence): void
    {
        $this->sequence = $sequence;
    }

    public function getRequiredSequence(): ?Sequence
    {
        return $this->requiredSequence;
    }

    public function setRequiredSequence(Sequence $requiredSequence): void
    {
        $this->requiredSequence = $requiredSequence;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): void
    {
        $this->status = $status;
    }

    public function getProgression(): ?float
    {
        return $this->progression;
    }

    public function setProgression(?float $progression): void
    {
        $this->progression = $progression;
    }

    public function getMinScore(): ?float
    {
        return $this->minScore;
    }

    public function setMinScore(?float $minScore): void
    {
        $this->minScore = $minScore;
    }

    public function getMaxScore(): ?float
    {
        return $this->maxScore;
    }

    public function setMaxScore(?float $maxScore): void
    {
        $this->maxScore = $maxScore;
    }
}
