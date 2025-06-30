<?php

namespace Claroline\CoreBundle\Component\Resource;

use Symfony\Component\HttpFoundation\File\File;

interface FileAdapterInterface extends AdapterInterface
{
    /**
     * Check if the resource supports the submitted file.
     */
    public function supportsFile(File $file): int;

    /**
     * Extract additional information from the file to populate the ressource at creation if any.
     */
    public function fromFile(File $file): ?array;
}
