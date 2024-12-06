<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Entity\Validation;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\CoreBundle\Entity\User as ClarolineUser;
use Claroline\ForumBundle\Entity\Forum;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_forum_user')]
#[ORM\Entity]
class User
{
    use Id;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: ClarolineUser::class, cascade: ['persist', 'remove'])]
    private ?ClarolineUser $user = null;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Forum::class, cascade: ['persist'])]
    private ?Forum $forum = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $notified = false;

    public function setUser(ClarolineUser $user): void
    {
        $this->user = $user;
    }

    public function getUser(): ?ClarolineUser
    {
        return $this->user;
    }

    public function setForum(Forum $forum): void
    {
        $this->forum = $forum;
    }

    public function getForum(): ?Forum
    {
        return $this->forum;
    }

    public function setNotified(bool $bool): void
    {
        $this->notified = $bool;
    }

    public function isNotified(): bool
    {
        return $this->notified;
    }
}
