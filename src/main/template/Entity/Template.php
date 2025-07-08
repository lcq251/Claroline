<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TemplateBundle\Entity;

use Claroline\AppBundle\API\Attribute\CrudEntity;
use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\AppBundle\Entity\Meta\Description;
use Claroline\AppBundle\Entity\Meta\Name;
use Claroline\TemplateBundle\Finder\TemplateType;
use Claroline\TemplateBundle\Model\TemplateContentInterface;
use Claroline\TemplateBundle\Model\TemplateInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_template')]
#[CrudEntity(finderClass: TemplateType::class)]
class Template implements TemplateInterface
{
    use Id;
    use Uuid;
    use Name;
    use Description;

    #[ORM\Column(name: 'entity_type')]
    private ?string $type = null;

    #[ORM\Column(name: 'is_default', type: Types::BOOLEAN)]
    private bool $default = false;

    /**
     * System templates cannot be edited nor deleted by users.
     * They are managed through DataFixtures.
     */
    #[ORM\Column(name: 'is_system', type: Types::BOOLEAN)]
    private bool $system = false;

    /**
     * @var Collection<int, TemplateContent>
     */
    #[ORM\OneToMany(targetEntity: TemplateContent::class, mappedBy: 'template', cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $contents;

    public function __construct()
    {
        $this->refreshUuid();

        $this->contents = new ArrayCollection();
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): void
    {
        $this->type = $type;
    }

    public function isDefault(): bool
    {
        return $this->default;
    }

    public function setDefault(bool $default): void
    {
        $this->default = $default;
    }

    public function isSystem(): bool
    {
        return $this->system;
    }

    public function setSystem(bool $system): void
    {
        $this->system = $system;
    }

    public function getTemplateContents(): Collection
    {
        return $this->contents;
    }

    public function getTemplateContent(string $lang): ?TemplateContentInterface
    {
        foreach ($this->contents as $content) {
            if ($content->getLang() === $lang) {
                return $content;
            }
        }

        return null;
    }

    public function addTemplateContent(TemplateContent $content): void
    {
        if (!$this->contents->contains($content)) {
            $this->contents->add($content);
            $content->setTemplate($this);
        }
    }

    public function removeTemplateContent(TemplateContent $content): void
    {
        if ($this->contents->contains($content)) {
            $this->contents->removeElement($content);
            $content->setTemplate(null);
        }
    }
}
