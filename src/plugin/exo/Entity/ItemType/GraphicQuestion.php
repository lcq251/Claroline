<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Content\Image;
use UJM\ExoBundle\Entity\Misc\Area;

/**
 * A Graphic question.
 */
#[ORM\Table(name: 'ujm_interaction_graphic')]
#[ORM\Entity]
class GraphicQuestion extends AbstractItem
{
    public const SHAPE_RECT = 'rect';
    public const SHAPE_CIRCLE = 'circle';

    /**
     * The image of the question.
     */
    #[ORM\ManyToOne(targetEntity: Image::class, cascade: ['persist'])]
    private ?Image $image = null;

    /**
     * @var Collection<int, Area>
     */
    #[ORM\OneToMany(targetEntity: Area::class, mappedBy: 'interactionGraphic', cascade: ['all'], orphanRemoval: true)]
    private Collection $areas;

    public function __construct()
    {
        $this->areas = new ArrayCollection();
    }

    public function getImage(): ?Image
    {
        return $this->image;
    }

    public function setImage(Image $image): void
    {
        $this->image = $image;
    }

    public function getAreas(): Collection
    {
        return $this->areas;
    }

    public function addArea(Area $area): void
    {
        if (!$this->areas->contains($area)) {
            $this->areas->add($area);
            $area->setInteractionGraphic($this);
        }
    }

    public function removeArea(Area $area): void
    {
        if ($this->areas->contains($area)) {
            $this->areas->removeElement($area);
        }
    }
}
