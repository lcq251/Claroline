<?php

namespace Claroline\EvaluationBundle\Component\Log\Operational;

use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CoreBundle\Library\RoutingHelper;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\LogBundle\Component\Log\AbstractOperationalLog;

class LogSequence extends AbstractOperationalLog
{
    public function __construct(
        private readonly RoutingHelper $routingHelper
    ) {
    }

    public static function getName(): string
    {
        return 'sequence';
    }

    protected static function getEntityClass(): string
    {
        return Sequence::class;
    }

    /** @param Sequence $object */
    protected function getObjectPath(object $object): ?string
    {
        return $this->routingHelper->toolUrl('progression', WorkspaceContext::getName(), $object->getWorkspace()?->getContextIdentifier())
            .'/sequences/'.$object->getUuid();
    }

    /** @param Sequence $object */
    protected function getContext(object $object): string
    {
        return WorkspaceContext::getName();
    }

    /** @param Sequence $object */
    protected function getContextId(object $object): ?string
    {
        return $object->getWorkspace()?->getContextIdentifier();
    }
}
