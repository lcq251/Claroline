<?php

namespace UJM\ExoBundle\Entity\Misc;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Library\Model\ContentTrait;

#[ORM\Table(name: 'ujm_grid_item')]
#[ORM\Entity]
class GridItem
{
    use Id;
    use ContentTrait;
    use Uuid;

    /**
     * X coordinate of the item in the grid.
     */
    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $coordsX = null;

    /**
     * Y coordinate of the item in the grid.
     */
    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $coordsY = null;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function getCoordsX(): ?int
    {
        return $this->coordsX;
    }

    public function setCoordsX(?int $coordsX): void
    {
        $this->coordsX = $coordsX;
    }

    public function getCoordsY(): ?int
    {
        return $this->coordsY;
    }

    public function setCoordsY(?int $coordsY): void
    {
        $this->coordsY = $coordsY;
    }

    public function getCoords(): ?array
    {
        return (is_int($this->coordsX) || is_int($this->coordsY)) ?
            [$this->coordsX, $this->coordsY] : null;
    }
}
