<?php

namespace Claroline\TransferBundle\Component\Importer;

use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Psr\Log\LoggerInterface;
use Psr\Log\LoggerTrait;

class ImportLogger implements LoggerInterface
{
    use LoggerTrait;

    public function log($level, \Stringable|string $message, array $context = []): void
    {
        $log = [
            'type' => $level,
            'line' => $context['line'] ?? null,
            'message' => $message,
            'link' => $context['line'] ?? null,
            'date' => DateNormalizer::normalize(new \DateTime()),
        ];
    }
}
