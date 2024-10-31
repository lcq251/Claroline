<?php

namespace UJM\ExoBundle\Entity\Item;

use Claroline\AppBundle\API\Attribute\CrudEntity;
use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\AppBundle\Entity\Meta\Creator;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Finder\ItemType;
use UJM\ExoBundle\Repository\ItemRepository;

#[ORM\Table(name: 'ujm_question')]
#[ORM\Entity(repositoryClass: ItemRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[CrudEntity(finderClass: ItemType::class)]
class Item
{
    use Id;
    use Uuid;
    use Creator;

    /**
     * The mime type of the Item type.
     */
    #[ORM\Column('mime_type', type: Types::STRING)]
    private ?string $mimeType = null;

    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $content = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $feedback = null;

    /**
     * The creation date of the question.
     */
    #[ORM\Column(name: 'date_create', type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateCreate = null;

    /**
     * The last update date of the question.
     */
    #[ORM\Column(name: 'date_modify', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $dateModify = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    /**
     * @var Collection<int, Hint>
     */
    #[ORM\OneToMany(targetEntity: Hint::class, mappedBy: 'question', cascade: ['remove', 'persist'], orphanRemoval: true)]
    private Collection $hints;

    /**
     * @var Collection<int, ItemObject>
     */
    #[ORM\OneToMany(targetEntity: ItemObject::class, mappedBy: 'question', cascade: ['remove', 'persist'], orphanRemoval: true)]
    #[ORM\OrderBy(['order' => 'ASC'])]
    private Collection $objects;

    /**
     * A list of additional Resources that can help to answer the question.
     *
     * @var Collection<int, ItemResource>
     */
    #[ORM\OneToMany(targetEntity: ItemResource::class, mappedBy: 'question', cascade: ['remove', 'persist'], orphanRemoval: true)]
    #[ORM\OrderBy(['order' => 'ASC'])]
    private Collection $resources;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $scoreRule = null;

    /**
     * The linked interaction entity.
     * This is populated by Doctrine Lifecycle events.
     */
    private ?AbstractItem $interaction = null;

    /**
     * Allows other user to edit a question.
     */
    #[ORM\Column(name: 'protect_update', type: Types::BOOLEAN)]
    private bool $protectUpdate = false;

    /**
     * The is answer mandatory to continue the quiz.
     *
     * @deprecated Moved on StepQuestion
     */
    #[ORM\Column(name: 'mandatory', type: Types::BOOLEAN)]
    private bool $mandatory = false;

    #[ORM\Column(name: 'expected_answers', type: Types::BOOLEAN)]
    private bool $expectedAnswers = true;

    public function __construct()
    {
        $this->refreshUuid();

        $this->hints = new ArrayCollection();
        $this->objects = new ArrayCollection();
        $this->resources = new ArrayCollection();
        $this->dateCreate = new \DateTime();
        $this->dateModify = new \DateTime();
    }

    /**
     * NB. This is required to make Tags work properly.
     */
    public function __toString(): string
    {
        if (!empty($this->getTitle())) {
            return $this->getTitle();
        }

        return substr(strip_tags($this->content), 0, 50);
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): void
    {
        $this->mimeType = $mimeType;
    }

    public function setTitle(?string $title): void
    {
        $this->title = $title;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setContent(string $content): void
    {
        $this->content = $content;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    /**
     * Gets content without html.
     */
    public function getContentText(): ?string
    {
        return strip_tags($this->content);
    }

    public function getObjects(): Collection
    {
        return $this->objects;
    }

    public function addObject(ItemObject $object): void
    {
        if (!$this->objects->contains($object)) {
            $this->objects->add($object);
            $object->setQuestion($this);
        }
    }

    public function removeObject(ItemObject $object): void
    {
        if ($this->objects->contains($object)) {
            $this->objects->removeElement($object);
            $object->setQuestion(null);
        }
    }

    public function emptyObjects(): void
    {
        $this->objects->clear();
    }

    public function getResources(): Collection
    {
        return $this->resources;
    }

    public function addResource(ItemResource $resource): void
    {
        if (!$this->resources->contains($resource)) {
            $this->resources->add($resource);
            $resource->setQuestion($this);
        }
    }

    public function removeResource(ItemResource $resource): void
    {
        if ($this->resources->contains($resource)) {
            $this->resources->removeElement($resource);
            $resource->setQuestion(null);
        }
    }

    public function setFeedback(?string $feedback): void
    {
        $this->feedback = $feedback;
    }

    public function getFeedback(): string
    {
        return $this->feedback ?: '';
    }

    #[ORM\PrePersist]
    public function updateDateCreate(): void
    {
        if (empty($this->dateCreate)) {
            $this->dateCreate = new \DateTime();
        }
    }

    public function getDateCreate(): ?\DateTimeInterface
    {
        return $this->dateCreate;
    }

    #[ORM\PreUpdate]
    public function updateDateModify(): void
    {
        $this->dateModify = new \DateTime();
    }

    public function getDateModify(): ?\DateTimeInterface
    {
        return $this->dateModify;
    }

    public function getHints(): Collection
    {
        return $this->hints;
    }

    public function addHint(Hint $hint): void
    {
        if (!$this->hints->contains($hint)) {
            $this->hints->add($hint);
            $hint->setQuestion($this);
        }
    }

    public function removeHint(Hint $hint): void
    {
        if ($this->hints->contains($hint)) {
            $this->hints->removeElement($hint);
        }
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    public function getDescription(): string
    {
        return $this->description ?: '';
    }

    public function getInteraction(): ?AbstractItem
    {
        return $this->interaction;
    }

    public function setInteraction(AbstractItem $interaction): void
    {
        $this->interaction = $interaction;
    }

    public function getScoreRule(): ?string
    {
        return $this->scoreRule;
    }

    public function setScoreRule(string $scoreRule): void
    {
        $this->scoreRule = $scoreRule;
    }

    public function setProtectUpdate(bool $protectUpdate): void
    {
        $this->protectUpdate = $protectUpdate;
    }

    public function getProtectUpdate(): bool
    {
        return $this->protectUpdate;
    }

    public function setMandatory(bool $mandatory): void
    {
        $this->mandatory = $mandatory;
    }

    public function isMandatory(): bool
    {
        return $this->mandatory;
    }

    public function hasExpectedAnswers(): bool
    {
        return $this->expectedAnswers;
    }

    public function setExpectedAnswers(bool $expectedAnswers): void
    {
        $this->expectedAnswers = $expectedAnswers;
    }
}
