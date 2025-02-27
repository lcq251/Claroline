<?php

namespace Claroline\EvaluationBundle\Entity\Certificate;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\MappedSuperclass]
abstract class AbstractCertificate
{
    use Uuid;
    use Id;

    #[ORM\Column(name: 'obtention_date', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $obtentionDate = null;

    #[ORM\Column(name: 'issue_date', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $issueDate = null;

    #[ORM\Column(name: 'content', type: Types::TEXT, nullable: true)]
    private ?string $content = null;

    #[ORM\Column(name: 'status', type: Types::STRING, length: 255, nullable: false)]
    private string $status;

    #[ORM\Column(name: 'score', type: Types::FLOAT, nullable: false)]
    private float $score;

    #[ORM\Column(name: 'language', type: Types::STRING, length: 255, nullable: false)]
    private string $language;

    #[ORM\JoinColumn(name: 'user_id', nullable: true, onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $user;

    #[ORM\Column(name: 'revoked', type: Types::BOOLEAN, options: ['default' => false])]
    private bool $revoked = false;

    #[ORM\Column(name: 'revocation_reason', type: Types::TEXT, nullable: true)]
    private ?string $revocationReason = null;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function getObtentionDate(): ?\DateTimeInterface
    {
        return $this->obtentionDate;
    }

    public function setObtentionDate(?\DateTimeInterface $obtentionDate): void
    {
        $this->obtentionDate = $obtentionDate;
    }

    public function getIssueDate(): ?\DateTimeInterface
    {
        return $this->issueDate;
    }

    public function setIssueDate(?\DateTimeInterface $issueDate): void
    {
        $this->issueDate = $issueDate;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): void
    {
        $this->content = $content;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getScore(): float
    {
        return $this->score;
    }

    public function setScore(float $score): void
    {
        $this->score = $score;
    }

    public function getLanguage(): string
    {
        return $this->language;
    }

    public function setLanguage(string $language): void
    {
        $this->language = $language;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): void
    {
        $this->user = $user;
    }

    public function isRevoked(): bool
    {
        return $this->revoked;
    }

    public function setRevoked(bool $revoked): void
    {
        $this->revoked = $revoked;
    }

    public function getRevocationReason(): ?string
    {
        return $this->revocationReason;
    }

    public function setRevocationReason(?string $revocationReason): void
    {
        $this->revocationReason = $revocationReason;
    }
}
