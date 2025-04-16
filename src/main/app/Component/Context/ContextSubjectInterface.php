<?php

namespace Claroline\AppBundle\Component\Context;

use Claroline\AppBundle\Entity\IdentifiableInterface;

interface ContextSubjectInterface extends IdentifiableInterface
{
    public function getContextIdentifier(): string;
}
