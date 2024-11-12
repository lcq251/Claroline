<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Security;

use Claroline\AppBundle\Security\ObjectCollection;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Security\Collection\ResourceCollection;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Allows the target class to checks the current user permissions on an object.
 */
trait PermissionCheckerTrait
{
    private AuthorizationCheckerInterface $authorization;

    protected function checkPermission(mixed $permission, mixed $object = null, ?array $options = [], ?bool $throwException = false): bool
    {
        $subject = null;
        if ($object) {
            switch ($object) {
                case $object instanceof ResourceNode:
                    $subject = new ResourceCollection([$object]);
                    break;
                case is_array($object):
                    $subject = new ObjectCollection($object, $options);
                    break;
                default:
                    $subject = new ObjectCollection([$object], $options);
            }
        }

        $granted = $this->authorization->isGranted($permission, $subject);
        if (!$granted && $throwException) {
            throw new AccessDeniedException($object ? sprintf('Operation "%s" cannot be done on object %s', $permission, get_class($object)) : sprintf('Permission "%s" denied', $permission));
        }

        return $granted;
    }
}
