<?php

namespace Claroline\CoreBundle\Component\Resource;

use Symfony\Component\HttpFoundation\File\File;

interface FileAdapterInterface
{
    public const UNSUPPORTED = 0;
    public const SUPPORTED_PARTIAL = 1;
    public const SUPPORTED = 2;

    public function supportsFile(File $file): int;

    public function fromFile(File $file): ?array;
}
