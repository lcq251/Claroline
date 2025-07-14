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
use Claroline\CursusBundle\Entity\Course;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

class CourseVoter extends AbstractVoter
{
    public function getClass(): string
    {
        return Course::class;
    }

    /**
     * @param Course $object
     */
    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options): int
    {
        $workspace = null;
        if ($object->getWorkspace()) {
            $workspace = $object->getWorkspace();
        }

        switch ($attributes[0]) {
            case self::ADMINISTRATE:
            case self::CREATE:
            case self::EDIT:
            case self::DELETE:
                if ($this->isToolGranted(self::EDIT, 'trainings')
                    || ($workspace && $this->isToolGranted(self::EDIT, 'trainings', $workspace))) {
                    return VoterInterface::ACCESS_GRANTED;
                }

                return VoterInterface::ACCESS_DENIED;

            case self::OPEN: // member of organization & OPEN right on tool
                if ($object->isPublic()
                    || $this->isToolGranted(self::OPEN, 'trainings')
                    || ($workspace && $this->isToolGranted(self::OPEN, 'trainings', $workspace))
                ) {
                    return VoterInterface::ACCESS_GRANTED;
                }

                return VoterInterface::ACCESS_DENIED;

            case self::FOLLOW:
                if ($this->isToolGranted(self::FOLLOW, 'trainings')
                    || ($workspace && $this->isToolGranted(self::FOLLOW, 'trainings', $workspace))) {
                    return VoterInterface::ACCESS_GRANTED;
                }

                return VoterInterface::ACCESS_DENIED;
        }

        return VoterInterface::ACCESS_ABSTAIN;
    }

    public function getSupportedActions(): array
    {
        return [self::OPEN, self::CREATE, self::EDIT, self::DELETE, self::FOLLOW, self::ADMINISTRATE];
    }
}
