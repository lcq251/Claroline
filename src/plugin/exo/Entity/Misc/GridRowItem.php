<?php

namespace UJM\ExoBundle\Entity\Misc;

use Claroline\AppBundle\Entity\Display\Order;
use Doctrine\ORM\Mapping as ORM;

/**
 * GridRowItem.
 */
#[ORM\Table('ujm_grid_row_item')]
#[ORM\Entity]
class GridRowItem
{
    use Order;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: GridRow::class, inversedBy: 'rowItems')]
    private ?GridRow $row = null;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: GridItem::class, cascade: ['persist'])]
    private ?GridItem $item = null;

    public function getRow(): ?GridRow
    {
        return $this->row;
    }

    public function setRow(GridRow $row): void
    {
        $this->row = $row;
    }

    public function getItem(): ?GridItem
    {
        return $this->item;
    }

    public function setItem(GridItem $item): void
    {
        $this->item = $item;
    }
}
