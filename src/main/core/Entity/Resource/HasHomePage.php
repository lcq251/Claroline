<?php

namespace Claroline\CoreBundle\Entity\Resource;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

trait HasHomePage
{
    /**
     * Show overview to users or directly start the resource.
     */
    #[ORM\Column(name: 'show_overview', type: Types::BOOLEAN)]
    private bool $showOverview = true;

    #[ORM\Column(name: 'description', type: Types::TEXT, nullable: true)]
    private ?string $overviewMessage = '';

    public function getShowOverview(): bool
    {
        return $this->showOverview;
    }

    public function setShowOverview(bool $showOverview): void
    {
        $this->showOverview = $showOverview;
    }

    public function getOverviewMessage(): ?string
    {
        return $this->overviewMessage;
    }

    public function setOverviewMessage(?string $overviewMessage = null): void
    {
        $this->overviewMessage = $overviewMessage;
    }
}
