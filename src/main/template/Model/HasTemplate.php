<?php

namespace Claroline\TemplateBundle\Model;

use Claroline\TemplateBundle\Entity\Template;
use Doctrine\ORM\Mapping as ORM;

/**
 * Allows to define a rendering template (eg. pdf print, email) for an entity.
 */
trait HasTemplate
{
    #[ORM\JoinColumn(name: 'template_id', nullable: true, onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: Template::class)]
    protected ?Template $template = null;

    public function getTemplate(): ?Template
    {
        return $this->template;
    }

    public function setTemplate(?Template $template = null): void
    {
        $this->template = $template;
    }
}
