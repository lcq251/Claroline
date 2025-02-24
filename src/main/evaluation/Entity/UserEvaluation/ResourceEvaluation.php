<?php

namespace Claroline\EvaluationBundle\Entity\UserEvaluation;

use Claroline\AppBundle\API\Attribute\CrudEntity;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\EvaluationBundle\Finder\ResourceEvaluationType;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Represents the global evaluation of a User for a ResourceNode.
 * There is only one for a user and a resource.
 */
#[ORM\Entity]
#[ORM\Table(name: 'claro_resource_user_evaluation')]
#[ORM\UniqueConstraint(name: 'resource_user_evaluation', columns: ['resource_node', 'user_id'])]
#[CrudEntity(finderClass: ResourceEvaluationType::class)]
class ResourceEvaluation extends AbstractUserEvaluation
{
    #[ORM\ManyToOne(targetEntity: ResourceNode::class)]
    #[ORM\JoinColumn(name: 'resource_node', onDelete: 'CASCADE')]
    private ?ResourceNode $resourceNode = null;

    #[ORM\Column(name: 'nb_attempts', type: Types::INTEGER)]
    private ?int $nbAttempts = 0;

    #[ORM\Column(name: 'nb_openings', type: Types::INTEGER)]
    private ?int $nbOpenings = 0;

    public function getResourceNode(): ?ResourceNode
    {
        return $this->resourceNode;
    }

    public function setResourceNode(ResourceNode $resourceNode): void
    {
        $this->resourceNode = $resourceNode;
    }

    public function getNbAttempts(): int
    {
        return $this->nbAttempts ?? 0;
    }

    public function setNbAttempts(int $nbAttempts): void
    {
        $this->nbAttempts = $nbAttempts;
    }

    public function getNbOpenings(): int
    {
        return $this->nbOpenings ?? 0;
    }

    public function setNbOpenings(int $nbOpenings): void
    {
        $this->nbOpenings = $nbOpenings;
    }

    public function isRequired(): bool
    {
        if ($this->resourceNode) {
            return $this->resourceNode->isRequired();
        }

        return false;
    }

    public function getEstimatedDuration(): ?int
    {
        if ($this->resourceNode) {
            return $this->resourceNode->getEstimatedDuration();
        }

        return 0;
    }

    public function isEvaluated(): bool
    {
        if ($this->resourceNode) {
            return $this->resourceNode->isEvaluated();
        }

        return false;
    }
}
