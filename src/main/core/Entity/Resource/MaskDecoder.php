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

use Doctrine\DBAL\Types\Types;
use Claroline\CoreBundle\Repository\Resource\ResourceMaskDecoderRepository;
use Claroline\AppBundle\Entity\Identifier\Id;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Index;

#[ORM\Table(name: 'claro_resource_mask_decoder')]
#[Index(name: 'value', columns: ['value'])]
#[Index(name: 'name', columns: ['name'])]
#[ORM\Entity(repositoryClass: ResourceMaskDecoderRepository::class, readOnly: true)]
class MaskDecoder
{
    use Id;

    public const OPEN = 1;
    public const COPY = 2;
    public const EXPORT = 4;
    public const DELETE = 8;
    public const EDIT = 16;
    public const ADMINISTRATE = 32;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $value = 0;

    #[ORM\Column]
    private ?string $name = null;

    #[ORM\ManyToOne(targetEntity: ResourceType::class, cascade: ['persist'], inversedBy: 'maskDecoders')]
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

    public function setResourceType(ResourceType $resourceType): void
    {
        if ($this->resourceType instanceof ResourceType) {
            $this->resourceType->removeMaskDecoder($this);
        }

        $this->resourceType = $resourceType;
        $this->resourceType->addMaskDecoder($this);
    }

    public function getResourceType(): ?ResourceType
    {
        return $this->resourceType;
    }
}
