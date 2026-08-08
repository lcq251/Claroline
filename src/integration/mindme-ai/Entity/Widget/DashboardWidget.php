<?php

namespace Claroline\MindMeAiBundle\Entity\Widget;

use Claroline\CoreBundle\Entity\Widget\Type\AbstractWidget;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_mindme_dashboard_widget')]
class DashboardWidget extends AbstractWidget
{
}
