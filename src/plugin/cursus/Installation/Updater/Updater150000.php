<?php

namespace Claroline\CursusBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\PublicContext;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\InstallationBundle\Updater\Updater;

class Updater150000 extends Updater
{
    public function __construct(private readonly ObjectManager $om)
    {
    }

    public function postUpdate(): void
    {
        $this->assignCoursesToOrganizations();

        // migrate registered groups to sessions and events
    }

    private function assignCoursesToOrganizations(): void
    {
        $defaultOrganization = $this->om->getRepository(Organization::class)->findOneBy([
            'default' => true,
        ]);


    }

    private function migrateGroupRegistrations(): void
    {

    }
}
