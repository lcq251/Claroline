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
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Doctrine\ORM\Mapping as ORM;

#[ORM\MappedSuperclass]
abstract class AbstractResource
{
    use Id;
    use Uuid;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\OneToOne(targetEntity: ResourceNode::class)]
    protected ?ResourceNode $resourceNode = null;

    /**
     * Only used for setting ResourceNode mimeType in old creation.
     *
     * @deprecated
     */
    protected ?string $mimeType = null;

    /**
     * Only used for setting ResourceNode name in old creation.
     *
     * @deprecated
     */
    protected ?string $name = null;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function setResourceNode(ResourceNode $resourceNode): void
    {
        $this->resourceNode = $resourceNode;
    }

    public function getResourceNode(): ?ResourceNode
    {
        return $this->resourceNode;
    }

    /**
     * Shortcut to access name from Resource.
     */
    public function getName(): ?string
    {
        return $this->name ?? $this->getResourceNode()->getName();
    }

    /**
     * @deprecated Only used by old creation process
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * DO NOT USE IT. It may be empty.
     *
     * @deprecated Only used by old creation process
     */
    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    /**
     * @deprecated Only used by old creation process
     */
    public function setMimeType(string $mimeType): void
    {
        $this->mimeType = $mimeType;
    }
}
