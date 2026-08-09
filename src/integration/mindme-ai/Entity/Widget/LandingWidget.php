<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Entity\Widget;

use Claroline\CoreBundle\Entity\Widget\Type\AbstractWidget;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Holds the JSON configuration of the landing page widgets
 * (hero / features / ai / packaging / cta).
 *
 * The whole configuration (title, copy, cards, items, buttons, seal...)
 * is stored as a single JSON document so each landing widget keeps an
 * arbitrary, admin-editable parameter structure without a dedicated table.
 */
#[ORM\Table(name: 'claro_mindme_landing_widget')]
#[ORM\Entity]
class LandingWidget extends AbstractWidget
{
    /**
     * The full widget configuration (JSON).
     */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $parameters = [];

    public function getParameters(): ?array
    {
        return $this->parameters;
    }

    public function setParameters(?array $parameters): void
    {
        $this->parameters = $parameters;
    }
}
