<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Entity\Resource;

use Claroline\AppBundle\Entity\Display\Order;
use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Generic "resource as input of another resource" reference.
 *
 * Both ends are plain ResourceNode, so any resource type can be a host and
 * any resource type can be an input. Flat list (no tree), ordered by entity_order.
 *
 * Deletion semantics:
 *  - host deleted   -> reference row cascades (onDelete CASCADE)
 *  - target deleted -> reference stays, target becomes null (dangling reference).
 */
#[ORM\Entity]
#[ORM\Table(name: 'mindme_aibase_resource_reference')]
#[ORM\UniqueConstraint(name: 'uniq_ref_host_user_target', columns: ['host_id', 'userId', 'target_id'])]
class ResourceReference
{
    use Id;
    use Uuid;
    use Order;

    public function __construct()
    {
        $this->refreshUuid();
    }

    /**
     * Host resource (any resource type; deleting it cascades the reference rows).
     */
    #[ORM\JoinColumn(name: 'host_id', nullable: false, onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: ResourceNode::class)]
    private ?ResourceNode $host = null;

    /**
     * Input resource (any resource type; deleting it leaves a dangling reference).
     */
    #[ORM\JoinColumn(name: 'target_id', nullable: true, onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: ResourceNode::class)]
    private ?ResourceNode $target = null;

    public function getHost(): ?ResourceNode
    {
        return $this->host;
    }

    public function setHost(ResourceNode $host): void
    {
        $this->host = $host;
    }

    /**
     * Associated user id (null = platform/shared link, set = that user's
     * personal "my links" row; UNIQUE(host_id, userId, target_id)).
     */
    #[ORM\Column(type: Types::INTEGER, nullable: true, name: 'userId')]
    private ?int $userId = null;

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): void
    {
        $this->userId = $userId;
    }

    public function getTarget(): ?ResourceNode
    {
        return $this->target;
    }

    public function setTarget(?ResourceNode $target): void
    {
        $this->target = $target;
    }
}