<?php

namespace Claroline\CoreBundle\Component\Resource;

interface UrlAdapterInterface
{
    public const UNSUPPORTED = 0;
    public const SUPPORTED_PARTIAL = 1;
    public const SUPPORTED = 2;

    public function supportsUrl(string $url): int;

    public function fromUrl(string $url): ?array;
}
