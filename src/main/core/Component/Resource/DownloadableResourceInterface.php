<?php

namespace Claroline\CoreBundle\Component\Resource;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;

/**
 * Implement this interface in your ResourceComponent to make it downloadable.
 */
interface DownloadableResourceInterface
{
    /**
     * Download a "stand alone" version of the resource (most likely a PDF).
     * It returns the path to the generated file to download.
     *
     * NB. Not all resource types are able to create a downloadable version.
     */
    public function download(AbstractResource $resource): ?string;
}
