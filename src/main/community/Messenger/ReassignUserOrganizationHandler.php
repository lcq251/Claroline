<?php

namespace Claroline\CommunityBundle\Messenger;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Messenger\Message\ReassignOrganization;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Assign workspaces with no organization to the default one.
 */
#[AsMessageHandler]
class ReassignUserOrganizationHandler
{
    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    public function __invoke(ReassignOrganization $reassignOrganization): void
    {
        $users = $this->om->getRepository(User::class)->findWithNoOrganization();

        foreach ($users as $user) {
            $user->addOrganization($reassignOrganization->getOrganization());
            $this->om->persist($user);
        }

        $this->om->flush();
    }
}
