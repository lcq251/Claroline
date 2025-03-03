<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Misc\Cell;
use UJM\ExoBundle\Library\Model\PenaltyTrait;

/**
 * A grid question.
 */
#[ORM\Table(name: 'ujm_question_grid')]
#[ORM\Entity]
class GridQuestion extends AbstractItem
{
    /*
     * The penalty to apply to each wrong answer
     */
    use PenaltyTrait;

    /**
     * @var string
     */
    public const SUM_CELL = 'cell';

    /**
     * @var string
     */
    public const SUM_COLUMN = 'col';

    /**
     * @var string
     */
    public const SUM_ROW = 'row';

    /**
     * List of available cells for the question.
     *
     * @var Collection<int, Cell>
     */
    #[ORM\OneToMany(targetEntity: Cell::class, mappedBy: 'question', cascade: ['all'], orphanRemoval: true)]
    private Collection $cells;

    /**
     * Sum sub mode ["cell", "row", "col"].
     */
    #[ORM\Column(type: Types::STRING)]
    private string $sumMode = self::SUM_CELL;

    /**
     * Number of rows to draw.
     */
    #[ORM\Column(name: 'grid_rows', type: Types::INTEGER)]
    private ?int $rows = null;

    /**
     * Number of columns to draw.
     */
    #[ORM\Column(name: 'grid_columns', type: Types::INTEGER)]
    private ?int $columns = null;

    /**
     * Grid border width.
     */
    #[ORM\Column(type: Types::INTEGER)]
    private int $borderWidth = 1;

    /**
     * Grid border color.
     */
    #[ORM\Column(type: Types::STRING)]
    private ?string $borderColor = '#DDDDDD';

    public function __construct()
    {
        $this->cells = new ArrayCollection();
    }

    /**
     * Get cells.
     *
     * @return Cell[]|ArrayCollection
     */
    public function getCells(): Collection
    {
        return $this->cells;
    }

    public function getCell(string $uuid): ?Cell
    {
        $found = null;
        foreach ($this->cells as $cell) {
            if ($cell->getUuid() === $uuid) {
                $found = $cell;
                break;
            }
        }

        return $found;
    }

    public function addCell(Cell $cell): void
    {
        if (!$this->cells->contains($cell)) {
            $cell->SetQuestion($this);
            $this->cells->add($cell);
        }
    }

    public function removeCell(Cell $cell): void
    {
        if ($this->cells->contains($cell)) {
            $this->cells->removeElement($cell);
        }
    }

    public function setSumMode(string $mode): void
    {
        $this->sumMode = $mode;
    }

    public function getSumMode(): string
    {
        return $this->sumMode;
    }

    public function setRows(int $rows): void
    {
        $this->rows = $rows;
    }

    public function getRows(): ?int
    {
        return $this->rows;
    }

    public function setColumns(int $columns): void
    {
        $this->columns = $columns;
    }

    public function getColumns(): ?int
    {
        return $this->columns;
    }

    public function setBorderWidth(int $width): void
    {
        $this->borderWidth = $width;
    }

    public function getBorderWidth(): ?int
    {
        return $this->borderWidth;
    }

    public function setBorderColor(?string $color): void
    {
        $this->borderColor = $color;
    }

    public function getBorderColor(): ?string
    {
        return $this->borderColor;
    }

    public function getGridStyle(): array
    {
        return [
            'width' => $this->borderWidth,
            'color' => $this->borderColor,
        ];
    }
}
