<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Misc\BooleanChoice;

/**
 * A boolean question (ie true/false - yes/no ...).
 */
#[ORM\Table(name: 'ujm_boolean_question')]
#[ORM\Entity]
class BooleanQuestion extends AbstractItem
{
    /**
     * @var Collection<int, BooleanChoice>
     */
    #[ORM\OneToMany(targetEntity: BooleanChoice::class, mappedBy: 'question', cascade: ['all'], orphanRemoval: true)]
    private Collection $choices;

    public function __construct()
    {
        $this->choices = new ArrayCollection();
    }

    public function getChoice(string $uuid): ?BooleanChoice
    {
        $found = null;
        foreach ($this->choices as $choice) {
            if ($choice->getUuid() === $uuid) {
                $found = $choice;
                break;
            }
        }

        return $found;
    }

    public function getChoices(): Collection
    {
        return $this->choices;
    }

    public function addChoice(BooleanChoice $choice): void
    {
        if (!$this->choices->contains($choice)) {
            $this->choices->add($choice);
            $choice->setQuestion($this);
        }
    }

    public function removeChoice(BooleanChoice $choice): void
    {
        if ($this->choices->contains($choice)) {
            $this->choices->removeElement($choice);
        }
    }
}
