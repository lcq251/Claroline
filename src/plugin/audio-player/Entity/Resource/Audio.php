<?php

namespace Claroline\AudioPlayerBundle\Entity\Resource;

use Claroline\AppBundle\Entity\Meta\Description;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_audio_params')]
#[ORM\Entity]
class Audio extends AbstractResource
{
    use Description;

    public const MANAGER_TYPE = 'manager';
    public const USER_TYPE = 'user';
    public const NO_TYPE = 'none';

    #[ORM\Column(name: 'sections_type')]
    private string $sectionsType = self::MANAGER_TYPE;

    #[ORM\Column(name: 'rate_control', type: Types::BOOLEAN)]
    private bool $rateControl = true;

    #[ORM\Column(nullable: false)]
    private ?string $url = null;

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): void
    {
        $this->url = $url;
    }

    public function getSectionsType(): string
    {
        return $this->sectionsType;
    }

    public function setSectionsType(string $sectionsType): void
    {
        $this->sectionsType = $sectionsType;
    }

    public function getRateControl(): bool
    {
        return $this->rateControl;
    }

    public function setRateControl(bool $rateControl): void
    {
        $this->rateControl = $rateControl;
    }
}
