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
}
