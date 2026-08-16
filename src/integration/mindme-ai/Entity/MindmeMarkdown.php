<?php

namespace Claroline\MindMeAiBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_mindme_markdown')]
class MindmeMarkdown extends AbstractResource
{
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $content = null;

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): void
    {
        $this->content = $content;
    }
}