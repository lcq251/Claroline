<?php

namespace Claroline\AnnouncementBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\InstallationBundle\Updater\Helper\RemoveResourceTrait;
use Claroline\InstallationBundle\Updater\Updater;

class Updater150000 extends Updater
{
    use RemoveResourceTrait;

    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    public function postUpdate(): void
    {
        $this->removeResource('claroline_announcement_aggregate');
    }
}
