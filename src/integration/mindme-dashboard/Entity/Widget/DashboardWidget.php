<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\DashboardBundle\Entity\Widget;

use Claroline\CoreBundle\Entity\Widget\Type\AbstractWidget;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Holds the JSON configuration of the desktop dashboard widgets
 * (overview / workspace-tree / messages / recommendations).
 *
 * The whole widget configuration (title, card settings, recommendation
 * filters...) is stored as a single JSON document. Runtime data is injected
 * by DashboardWidgetSerializer from DashboardStatsManager.
 */
#[ORM\Table(name: 'mindme_dashboard_widget')]
#[ORM\Entity]
class DashboardWidget extends AbstractWidget
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