<?php

namespace Claroline\CoreBundle\Component\Resource;

interface UrlAdapterInterface extends AdapterInterface
{
    /**
     * Check if the resource supports the submitted url.
     */
    public function supportsUrl(string $url): int;

    /**
     * Extract additional information from the URL to populate the ressource at creation if any.
     */
    public function fromUrl(string $url): ?array;
}
