<?php

namespace Claroline\CommunityBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\CoreBundle\Entity\Facet\PanelFacet;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Configuration for users profile.
 * It contains the list of defined fields and some access restrictions.
 */
#[ORM\Table(name: 'claro_user_profile')]
#[ORM\Entity]
class UserProfile
{
    use Id;

    /**
     * @var Collection<int, PanelFacet>
     */
    #[ORM\ManyToMany(targetEntity: PanelFacet::class, cascade: ['persist'])]
    #[ORM\JoinTable(name: 'claro_user_profile_sections')]
    #[ORM\JoinColumn(name: 'profile_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ORM\InverseJoinColumn(name: 'section_id', referencedColumnName: 'id', unique: true, onDelete: 'CASCADE')]
    private Collection $sections;

    private Collection $showConfidentialRoles;
    private Collection $editLockedRoles;

    public function __construct()
    {
        $this->sections = new ArrayCollection();
    }

    public function addSection(PanelFacet $panelFacet): void
    {
        if (!$this->sections->contains($panelFacet)) {
            $this->sections->add($panelFacet);
        }
    }

    public function removeSection(PanelFacet $panelFacet): void
    {
        if ($this->sections->contains($panelFacet)) {
            $this->sections->removeElement($panelFacet);
        }
    }

    public function getSections(): Collection
    {
        return $this->sections;
    }
}
