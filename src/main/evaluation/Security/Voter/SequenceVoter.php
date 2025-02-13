<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\EvaluationBundle\Security\Voter;

use Claroline\AppBundle\Security\Voter\AbstractVoter;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

class SequenceVoter extends AbstractVoter
{
    public function getClass(): string
    {
        return Sequence::class;
    }

    /**
     * @param Sequence $object
     */
    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options): int
    {
        switch ($attributes[0]) {
            case self::OPEN:
            case self::VIEW:
                if ($this->isToolGranted(self::OPEN, 'evaluation', $object->getWorkspace())) {
                    return VoterInterface::ACCESS_GRANTED;
                }

                return VoterInterface::ACCESS_DENIED;

            case self::CREATE:
            case self::ADMINISTRATE:
            case self::EDIT:
            case self::DELETE:
                if ($this->isToolGranted(self::EDIT, 'evaluation', $object->getWorkspace())) {
                    return VoterInterface::ACCESS_GRANTED;
                }

                return VoterInterface::ACCESS_DENIED;
        }

        return VoterInterface::ACCESS_ABSTAIN;
    }
}
