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
use Claroline\CursusBundle\Entity\Session;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

class SessionVoter extends AbstractVoter
{
    public function getClass(): string
    {
        return Session::class;
    }

    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options): int
    {
        $granted = false;
        switch ($attributes[0]) {
            case self::CREATE:
            case self::EDIT:
            case self::DELETE:
            case self::ADMINISTRATE:
                $granted = $this->isGranted(self::EDIT, $object->getCourse());
                break;
            case self::OPEN:
                $granted = $this->isGranted(self::OPEN, $object->getCourse());
                break;
            case self::FOLLOW:
                $granted = $this->isGranted(self::FOLLOW, $object->getCourse());
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
