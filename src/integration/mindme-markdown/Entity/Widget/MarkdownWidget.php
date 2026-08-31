<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\MarkdownBundle\Entity\Widget;

use Claroline\CoreBundle\Entity\Widget\Type\AbstractWidget;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Markdown widget - stores markdown content and displays it with a TOC sidebar.
 */
#[ORM\Table(name: 'mindme_markdown_widget')]
#[ORM\Entity]
class MarkdownWidget extends AbstractWidget
{
    #[ORM\Column(type: Types::TEXT, nullable: true)]
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