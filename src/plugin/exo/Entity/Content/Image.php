<?php

namespace UJM\ExoBundle\Entity\Content;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'ujm_picture')]
#[ORM\Entity]
class Image
{
    use Id;
    use Uuid;

    #[ORM\Column(type: Types::STRING, length: 255)]
    private ?string $title = null;

    #[ORM\Column(name: 'url', type: Types::STRING, length: 255)]
    private ?string $url = null;

    #[ORM\Column(name: 'type', type: Types::STRING, length: 255)]
    private ?string $type = null;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $width = null;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $height = null;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function setTitle(?string $title): void
    {
        $this->title = $title;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setUrl(string $url): void
    {
        $this->url = $url;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setType(string $type): void
    {
        $this->type = $type;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setWidth(int $width): void
    {
        $this->width = $width;
    }

    public function getWidth(): ?int
    {
        return $this->width;
    }

    public function setHeight(int $height): void
    {
        $this->height = $height;
    }

    public function getHeight(): ?int
    {
        return $this->height;
    }
}
