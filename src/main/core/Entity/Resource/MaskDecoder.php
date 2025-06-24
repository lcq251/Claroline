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
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Index;

#[ORM\Table(name: 'claro_resource_mask_decoder')]
#[Index(name: 'value', columns: ['value'])]
#[Index(name: 'name', columns: ['name'])]
#[ORM\Entity(readOnly: true)]
class MaskDecoder
{
    use Id;

    public const DEFAULT_ACTIONS = ['open', 'contribute', 'export', /* 'follow', */ 'delete', 'edit', 'administrate'];
    public const DEFAULT_VALUES = [
        'open' => 1,
        'contribute' => 2,
        'export' => 4,
        'delete' => 8,
        'edit' => 16,
        'administrate' => 32,
        // 'follow' => 8,
    ];

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $value = 0;

    #[ORM\Column]
    private ?string $name = null;

    #[ORM\ManyToOne(targetEntity: ResourceType::class, inversedBy: 'maskDecoders')]
    #[ORM\JoinColumn(name: 'resource_type_id', nullable: false, onDelete: 'CASCADE')]
    private ?ResourceType $resourceType = null;

    public function setValue(int $position): void
    {
        $this->value = $position;
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setResourceType(?ResourceType $resourceType = null): void
    {
        if (!empty($this->resourceType)) {
            $this->resourceType->removeMaskDecoder($this);
        }

        $this->resourceType = $resourceType;

        if ($resourceType) {
            $this->resourceType->addMaskDecoder($this);
        }
    }

    public function getResourceType(): ?ResourceType
    {
        return $this->resourceType;
    }
}
