<?php

namespace Claroline\CoreBundle\Entity\Resource;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

trait HasEndPage
{
    /**
     * Show an end page when the user has finished the quiz.
     *
     * @deprecated
     */
    #[ORM\Column(name: 'show_end_page', type: Types::BOOLEAN)]
    private bool $showEndPage = false;

    /**
     * A message to display at the end of the quiz.
     */
    #[ORM\Column(name: 'end_message', type: Types::TEXT, nullable: true)]
    private ?string $endMessage = '';

    /**
     * Show navigation buttons on the end page.
     */
    #[ORM\Column(name: 'end_navigation', type: Types::BOOLEAN)]
    private bool $endNavigation = false;

    #[ORM\Column(name: 'end_back_type', type: Types::TEXT, nullable: true)]
    private ?string $endBackType = null;

    #[ORM\Column(name: 'end_back_label', type: Types::TEXT, nullable: true)]
    private ?string $endBackLabel = null;

    #[ORM\JoinColumn(name: 'end_back_target_id', nullable: true, onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: ResourceNode::class)]
    private ?ResourceNode $endBackTarget = null;

    /**
     * Show buttons on the end page to download WS certificates (participation and success).
     */
    #[ORM\Column(name: 'show_workspace_certificates', type: Types::BOOLEAN)]
    private bool $showWorkspaceCertificates = false;

    public function getShowEndPage(): bool
    {
        return $this->showEndPage;
    }

    public function setShowEndPage(bool $showEndPage): void
    {
        $this->showEndPage = $showEndPage;
    }

    public function getEndMessage(): ?string
    {
        return $this->endMessage;
    }

    public function setEndMessage(?string $endMessage = null): void
    {
        $this->endMessage = $endMessage;
    }

    public function hasEndNavigation(): bool
    {
        return $this->endNavigation;
    }

    public function setEndNavigation(bool $endNavigation): void
    {
        $this->endNavigation = $endNavigation;
    }

    public function getEndBackType(): ?string
    {
        return $this->endBackType;
    }

    public function setEndBackType(?string $endBackType = null): void
    {
        $this->endBackType = $endBackType;
    }

    public function getEndBackLabel(): ?string
    {
        return $this->endBackLabel;
    }

    public function setEndBackLabel(?string $endBackLabel = null): void
    {
        $this->endBackLabel = $endBackLabel;
    }

    public function getEndBackTarget(): ?ResourceNode
    {
        return $this->endBackTarget;
    }

    public function setEndBackTarget(?ResourceNode $endBackTarget = null): void
    {
        $this->endBackTarget = $endBackTarget;
    }

    /**
     * @deprecated
     */
    public function getShowWorkspaceCertificates(): bool
    {
        return $this->showWorkspaceCertificates;
    }

    /**
     * @deprecated
     */
    public function setShowWorkspaceCertificates(bool $showWorkspaceCertificates): void
    {
        $this->showWorkspaceCertificates = $showWorkspaceCertificates;
    }
}
