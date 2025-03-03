<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Misc\OrderingItem;
use UJM\ExoBundle\Library\Model\PenaltyTrait;
use UJM\ExoBundle\Library\Options\Direction;

/**
 * An ordering question.
 */
#[ORM\Table(name: 'ujm_question_ordering')]
#[ORM\Entity]
class OrderingQuestion extends AbstractItem
{
    use PenaltyTrait;

    /**
     * The user will reorder items within container.
     *
     * @var string
     */
    public const MODE_INSIDE = 'inside';

    /**
     * The user will reorder items in another container.
     *
     * @var string
     */
    public const MODE_BESIDE = 'beside';

    /**
     * @var Collection<int, OrderingItem>
     */
    #[ORM\OneToMany(targetEntity: OrderingItem::class, mappedBy: 'question', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\OrderBy(['position' => 'ASC'])]
    private Collection $items;

    #[ORM\Column(type: Types::STRING)]
    private string $direction = Direction::VERTICAL;

    #[ORM\Column(type: Types::STRING)]
    private string $mode = self::MODE_INSIDE;

    public function __construct()
    {
        $this->items = new ArrayCollection();
    }

    public function setMode(string $mode): void
    {
        if (self::MODE_INSIDE === $mode || self::MODE_BESIDE === $mode) {
            $this->mode = $mode;
        }
    }

    public function getMode(): string
    {
        return $this->mode;
    }

    public function setDirection(string $direction): void
    {
        $this->direction = $direction;
    }

    public function getDirection(): string
    {
        return $this->direction;
    }

    /**
     * Get items.
     *
     * @return OrderingItem[]|ArrayCollection
     */
    public function getItems(): Collection
    {
        return $this->items;
    }

    public function getItem($uuid): ?OrderingItem
    {
        $found = null;
        foreach ($this->items as $item) {
            if ($item->getUuid() === $uuid) {
                $found = $item;
                break;
            }
        }

        return $found;
    }

    public function addItem(OrderingItem $item): void
    {
        if (!$this->items->contains($item)) {
            $item->setQuestion($this);
            $this->items->add($item);
        }
    }

    public function removeItem(OrderingItem $item): void
    {
        if ($this->items->contains($item)) {
            $this->items->removeElement($item);
        }
    }
}
