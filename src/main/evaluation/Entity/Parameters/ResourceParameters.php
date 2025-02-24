<?php

namespace Claroline\EvaluationBundle\Entity\Parameters;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_evaluation_resource_parameters')]
class ResourceParameters extends AbstractEvaluationParameters
{
    #[ORM\JoinColumn(name: 'resource_id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: ResourceNode::class)]
    private ?ResourceNode $resource = null;

    /**
     * A message to display when a user has done all its attempts.
     */
    #[ORM\Column(name: 'attempts_reached_message', type: Types::TEXT, nullable: true)]
    private ?string $attemptsReachedMessage = null;

    public function getResource(): ?ResourceNode
    {
        return $this->resource;
    }

    public function setResource(ResourceNode $resourceNode): void
    {
        $this->resource = $resourceNode;
    }

    public function getAttemptsReachedMessage(): ?string
    {
        return $this->attemptsReachedMessage;
    }

    public function setAttemptsReachedMessage(string $attemptsReachedMessage = null): void
    {
        $this->attemptsReachedMessage = $attemptsReachedMessage;
    }
}
