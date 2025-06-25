<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity;

use Claroline\AppBundle\API\Attribute\CrudEntity;
use Claroline\AppBundle\Entity\CrudEntityInterface;
use Claroline\AppBundle\Entity\Display\Poster;
use Claroline\AppBundle\Entity\Display\Thumbnail;
use Claroline\AppBundle\Entity\Identifier\Code;
use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\AppBundle\Entity\Meta\Description;
use Claroline\AppBundle\Entity\Meta\Name;
use Claroline\CommunityBundle\Finder\GroupType;
use Claroline\CommunityBundle\Repository\GroupRepository;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_group')]
#[ORM\Entity(repositoryClass: GroupRepository::class)]
#[CrudEntity(
    finderClass: GroupType::class
)]
class Group extends AbstractRoleSubject implements CrudEntityInterface
{
    use Id;
    use Uuid;
    use Code;
    use Name;
    use Description;
    use Poster;
    use Thumbnail;

    /**
     * If true, the Group will contain all the Users of the Organization.
     */
    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => 0])]
    private bool $everyone = false;

    /**
     * @var Collection<int, Role>
     */
    #[ORM\ManyToMany(targetEntity: Role::class, fetch: 'EXTRA_LAZY')]
    #[ORM\JoinTable(name: 'claro_group_role')]
    protected Collection $roles;

    #[ORM\ManyToOne(targetEntity: Organization::class)]
    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    private ?Organization $organization = null;

    public function __construct()
    {
        parent::__construct();

        $this->refreshUuid();

        $this->roles = new ArrayCollection();
    }

    public static function getIdentifiers(): array
    {
        return ['code'];
    }

    public function __toString(): string
    {
        return $this->name;
    }

    public function hasEveryone(): bool
    {
        return $this->everyone;
    }

    public function setEveryone(bool $everyone): void
    {
        $this->everyone = $everyone;
    }

    /**
     * For security {@see OrganizationMemberVoter} and {@see OrganizationManagerVoter}.
     */
    public function getOrganizations(): array
    {
        return [$this->organization];
    }

    public function getOrganization(): ?Organization
    {
        return $this->organization;
    }

    public function setOrganization(Organization $organization): void
    {
        $this->organization = $organization;
    }

    /**
     * @deprecated no replacement. Required by TransferFeature and GroupController::HasUsersTrait.
     */
    public function addUser(User $user): void
    {
        $user->addGroup($this);
    }

    /**
     * @deprecated no replacement. Required by TransferFeature and GroupController::HasUsersTrait.
     */
    public function removeUser(User $user): void
    {
        $user->removeGroup($this);
    }
}
