<?php

namespace Claroline\CoreBundle\Component\Log\Operational;

use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Library\RoutingHelper;
use Claroline\LogBundle\Component\Log\AbstractOperationalLog;

class LogResource extends AbstractOperationalLog
{
    public function __construct(
        private readonly RoutingHelper $routingHelper
    ) {
    }

    public static function getName(): string
    {
        return 'resource';
    }

    protected static function getEntityClass(): string
    {
        return ResourceNode::class;
    }

    /** @param ResourceNode $object */
    protected function getObjectPath(object $object): ?string
    {
        return $this->routingHelper->resourceUrl($object);
    }

    /** @param ResourceNode $object */
    protected function getContext(object $object): string
    {
        return WorkspaceContext::getName();
    }

    /** @param ResourceNode $object */
    protected function getContextId(object $object): ?string
    {
        return $object->getWorkspace()?->getContextIdentifier();
    }
}
