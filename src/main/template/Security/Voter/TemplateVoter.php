<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TemplateBundle\Security\Voter;

use Claroline\AppBundle\Security\Voter\AbstractVoter;
use Claroline\TemplateBundle\Entity\Template;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

class TemplateVoter extends AbstractVoter
{
    /**
     * @param Template $object
     */
    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options): int
    {
        switch ($attributes[0]) {
            case self::CREATE:
            case self::OPEN:
                return $this->hasAdminToolAccess($token, 'templates') ?
                    VoterInterface::ACCESS_GRANTED :
                    VoterInterface::ACCESS_DENIED;

            case self::EDIT:
            case self::DELETE:
            case self::PATCH:
                if ($object->isSystem()) {
                    // system templates are managed through claroline updates, so nobody can modify them
                    return VoterInterface::ACCESS_DENIED;
                }

                return $this->hasAdminToolAccess($token, 'templates') ?
                    VoterInterface::ACCESS_GRANTED :
                    VoterInterface::ACCESS_DENIED;
        }

        return VoterInterface::ACCESS_ABSTAIN;
    }

    public function getClass(): string
    {
        return Template::class;
    }

    public function getSupportedActions(): array
    {
        return [self::OPEN, self::CREATE, self::EDIT, self::DELETE, self::PATCH];
    }
}
