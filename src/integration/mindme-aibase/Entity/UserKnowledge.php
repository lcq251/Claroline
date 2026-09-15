<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Entity;

use Claroline\CoreBundle\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Per-user knowledge base for the digital teacher.
 *
 * Entries reuse the ai-avatar-bot knowledge format: an array of
 * {q, a, kw, source?} objects. q/a are required strings, kw is optional
 * keyword text, source is an optional {type: pdf|url|text|json, title, url}.
 * The entries are injected into the LLM prompt as retrieval context so the
 * personal digital teacher answers from the user's own material.
 */
#[ORM\Entity]
#[ORM\Table(name: 'mindme_user_knowledge')]
class UserKnowledge
{
    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', unique: true, nullable: false, onDelete: 'CASCADE')]
    private User $user;

    /** Knowledge entries: array of {q, a, kw, source?}. */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $entries = [];

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getEntries(): ?array
    {
        return $this->entries;
    }

    public function setEntries(?array $entries): void
    {
        $this->entries = $entries;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }
}
