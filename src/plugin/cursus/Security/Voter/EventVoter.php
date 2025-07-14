<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Security\Voter;

use Claroline\AppBundle\Security\Voter\AbstractVoter;
use Claroline\CursusBundle\Entity\Event;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

class EventVoter extends AbstractVoter
{
    public function getClass(): string
    {
        return Event::class;
    }

    /**
     * @param Event $object
     */
    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options): int
    {
        $granted = false;
        switch ($attributes[0]) {
            case self::CREATE:
            case self::EDIT:
            case self::ADMINISTRATE:
            case self::DELETE:
                $granted = $this->isGranted(self::EDIT, $object->getSession());
                break;
            case self::OPEN:
                $granted = $this->isGranted(self::OPEN, $object->getSession());
                break;
            case self::FOLLOW:
                $granted = $this->isGranted(self::FOLLOW, $object->getSession());
                break;
        }

        if ($granted) {
            return VoterInterface::ACCESS_GRANTED;
        }

        return VoterInterface::ACCESS_DENIED;
    }

    public function getSupportedActions(): array
    {
        return [self::OPEN, self::CREATE, self::EDIT, self::DELETE, self::FOLLOW, self::ADMINISTRATE];
    }
}
