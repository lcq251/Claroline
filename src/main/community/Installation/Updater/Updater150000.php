<?php

namespace Claroline\CommunityBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Component\Tool\OrganizationsTool;
use Claroline\CoreBundle\Component\Context\AdministrationContext;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\InstallationBundle\Updater\Updater;

class Updater150000 extends Updater
{
    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    public function postUpdate(): void
    {
        $orderedTool = new OrderedTool();
        $orderedTool->setContextName(AdministrationContext::getName());
        $orderedTool->setName(OrganizationsTool::getName());

        $this->om->persist($orderedTool);
        $this->om->flush();
    }
}
