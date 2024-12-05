<?php

namespace Claroline\CoreBundle\Entity\Tool;

use Claroline\AppBundle\Entity\Identifier\Id;
use Doctrine\ORM\Mapping as ORM;

#[ORM\MappedSuperclass]
abstract class AbstractTool
{
    use Id;

    #[ORM\OneToOne(targetEntity: OrderedTool::class)]
    #[ORM\JoinColumn(name: 'tool_id', onDelete: 'CASCADE')]
    private OrderedTool $orderedTool;

    public function getOrderedTool(): OrderedTool
    {
        return $this->orderedTool;
    }

    public function setOrderedTool(OrderedTool $orderedTool): void
    {
        $this->orderedTool = $orderedTool;
    }
}
