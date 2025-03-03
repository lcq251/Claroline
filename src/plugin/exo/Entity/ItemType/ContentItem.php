<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * An Audio Content item.
 */
#[ORM\Table(name: 'ujm_item_content')]
#[ORM\Entity]
class ContentItem extends AbstractItem
{
    #[ORM\Column(name: 'content_data', type: Types::TEXT)]
    private ?string $data = null;

    public function getData(): ?string
    {
        return $this->data;
    }

    public function setData(?string $data): void
    {
        $this->data = $data;
    }

    public function isContentItem(): bool
    {
        return true;
    }
}
