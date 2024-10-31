<?php

namespace Claroline\TransferBundle\Transfer\Logger;

use Psr\Log\LoggerInterface;
use Psr\Log\LoggerTrait;

class ImportLogger implements LoggerInterface
{
    use LoggerTrait;

    public function log($level, \Stringable|string $message, array $context = []): void
    {
        // TODO: Implement log() method.
    }
}
