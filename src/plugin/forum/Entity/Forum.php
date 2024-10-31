<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\HasHomePage;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_forum')]
#[ORM\Entity]
class Forum extends AbstractResource
{
    use HasHomePage;

    public const VALIDATE_NONE = 'NONE';
    public const VALIDATE_PRIOR_ONCE = 'PRIOR_ONCE';
    public const VALIDATE_PRIOR_ALL = 'PRIOR_ALL';

    public const DISPLAY_TABLE_SM = 'table-sm';
    public const DISPLAY_TABLE = 'table';
    public const DISPLAY_LIST_SM = 'list-sm';
    public const DISPLAY_LIST = 'list';
    public const DISPLAY_TILES = 'tiles';
    public const DISPLAY_TILES_SM = 'tiles-sm';

    #[ORM\Column(type: Types::STRING)]
    private string $validationMode = self::VALIDATE_NONE;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $displayMessages = 3;

    #[ORM\Column(type: Types::STRING)]
    private string $dataListOptions = self::DISPLAY_LIST;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $lockDate = null;

    #[ORM\Column(options: ['default' => 'ASC'])]
    private string $messageOrder = 'ASC';

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => false])]
    private bool $expandComments = false;

    /**
     * @var Collection<int, Subject>
     */
    #[ORM\OneToMany(targetEntity: Subject::class, mappedBy: 'forum')]
    #[ORM\OrderBy(['id' => 'ASC'])]
    private Collection $subjects;

    public function __construct()
    {
        parent::__construct();

        $this->subjects = new ArrayCollection();
    }

    public function getSubjects(): Collection
    {
        return $this->subjects;
    }

    public function addSubject(Subject $subject): void
    {
        $this->subjects->add($subject);
    }

    public function removeSubject(Subject $subject): void
    {
        $this->subjects->removeElement($subject);
    }

    public function setValidationMode($mode): void
    {
        $this->validationMode = $mode;
    }

    public function getValidationMode(): string
    {
        return $this->validationMode;
    }

    public function setDataListOptions($options): void
    {
        $this->dataListOptions = $options;
    }

    public function getDataListOptions(): string
    {
        return $this->dataListOptions;
    }

    public function setLockDate(\DateTimeInterface $date = null): void
    {
        $this->lockDate = $date;
    }

    public function getLockDate(): ?\DateTimeInterface
    {
        return $this->lockDate;
    }

    public function setDisplayMessage(int $count): void
    {
        $this->displayMessages = $count;
    }

    public function getDisplayMessages(): ?int
    {
        return $this->displayMessages;
    }

    public function getMessageOrder(): string
    {
        return $this->messageOrder;
    }

    public function setMessageOrder(string $order): void
    {
        $this->messageOrder = $order;
    }

    public function getExpandComments(): bool
    {
        return $this->expandComments;
    }

    public function setExpandComments(bool $expand): void
    {
        $this->expandComments = $expand;
    }
}
