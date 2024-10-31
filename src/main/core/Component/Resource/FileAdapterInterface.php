<?php

namespace Claroline\CoreBundle\Component\Resource;

interface FileAdapterInterface
{
    public const UNSUPPORTED = 0;
    public const SUPPORTED_PARTIAL = 1;
    public const SUPPORTED = 2;

    public function supportsFile(\SplFileInfo $file): int;
}
