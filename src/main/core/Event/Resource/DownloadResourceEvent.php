<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event\Resource;

use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Event dispatched by the resource controller when a custom action is asked on a resource.
 */
class DownloadResourceEvent extends Event
{
    public function __construct(
        private readonly AbstractResource $resource,
        private readonly FileBag $fileBag,
    ) {
    }

    /**
     * Gets the resource ResourceNode entity.
     */
    public function getResourceNode(): ResourceNode
    {
        return $this->resource->getResourceNode();
    }

    public function getResource(): AbstractResource
    {
        return $this->resource;
    }

    public function getFileBag(): FileBag
    {
        return $this->fileBag;
    }
}
