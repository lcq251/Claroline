<?php

namespace Claroline\TransferBundle\Component\Importer;

use Claroline\AppBundle\Component\ComponentInterface;
use Claroline\AppBundle\Component\Context\ContextualInterface;
use Psr\Log\LoggerAwareInterface;

interface ImporterInterface extends LoggerAwareInterface, ComponentInterface, ContextualInterface
{
    public function validate(array $data): ?array;

    public function execute(array $data): void;
}
