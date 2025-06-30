<?php

namespace Claroline\CoreBundle\Component\Resource;

interface AdapterInterface
{
    public const UNSUPPORTED = 0;
    public const SUPPORTED_PARTIAL = 1;
    public const SUPPORTED = 2;

    /**
     * Define if the resource requires an adapter for the creation.
     */
    public function requireAdapter(): bool;
}
