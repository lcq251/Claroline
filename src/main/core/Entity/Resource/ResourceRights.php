<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity\Resource;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Repository\Resource\ResourceRightsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_resource_rights')]
#[ORM\Index(name: 'mask_idx', columns: ['mask'])]
#[ORM\UniqueConstraint(name: 'resource_rights_unique_resource_role', columns: ['resourceNode_id', 'role_id'])]
#[ORM\Entity(repositoryClass: ResourceRightsRepository::class)]
class ResourceRights
{
    use Id;

    #[ORM\Column(type: Types::INTEGER)]
    private int $mask = 0;

    #[ORM\ManyToOne(targetEntity: Role::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Role $role = null;

    #[ORM\ManyToOne(targetEntity: ResourceNode::class, inversedBy: 'rights')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?ResourceNode $resourceNode = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $creatableTypes = [];

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(Role $role): void
    {
        $this->role = $role;
    }

    public function getResourceNode(): ?ResourceNode
    {
        return $this->resourceNode;
    }

    public function setResourceNode(?ResourceNode $resourceNode = null): void
    {
        $this->resourceNode = $resourceNode;
    }

    public function getMask(): ?int
    {
        return $this->mask;
    }

    public function setMask(int $mask): void
    {
        $this->mask = $mask;
    }

    public function getCreatableResourceTypes(): ?array
    {
        return $this->creatableTypes;
    }

    public function setCreatableResourceTypes(?array $resourceTypes): void
    {
        $this->creatableTypes = $resourceTypes;
    }
}
