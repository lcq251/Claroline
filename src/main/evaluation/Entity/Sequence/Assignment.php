<?php

namespace Claroline\EvaluationBundle\Entity\Sequence;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\Role;
use Claroline\EvaluationBundle\Repository\Sequence\AssignmentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AssignmentRepository::class)]
#[ORM\Table(name: 'claro_evaluation_sequence_assignment')]
#[ORM\UniqueConstraint(name: 'unique_sequence_assignment', columns: ['sequence_id', 'role_id'])]
class Assignment
{
    use Id;
    use Uuid;

    #[ORM\ManyToOne(targetEntity: Sequence::class, inversedBy: 'assignments')]
    #[ORM\JoinColumn(name: 'sequence_id', onDelete: 'CASCADE')]
    private ?Sequence $sequence = null;

    #[ORM\ManyToOne(targetEntity: Role::class)]
    #[ORM\JoinColumn(name: 'role_id', onDelete: 'CASCADE')]
    private ?Role $role = null;

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => 0])]
    private bool $required = false;

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => 0])]
    private bool $scored = false;

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

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(Role $role): void
    {
        $this->role = $role;
    }

    public function isRequired(): bool
    {
        return $this->required;
    }

    public function setRequired(bool $required): void
    {
        $this->required = $required;
    }

    public function isScored(): bool
    {
        return $this->scored;
    }

    public function setScored(bool $scored): void
    {
        $this->scored = $scored;
    }
}
