<?php

namespace Claroline\TransferBundle\Component\Importer;

use Psr\Log\LoggerAwareTrait;

abstract class AbstractImporter implements ImporterInterface
{
    use LoggerAwareTrait;
}
