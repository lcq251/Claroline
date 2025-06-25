<?php

namespace Claroline\OpenBadgeBundle\Messenger;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Messenger\Message\ReassignOrganization;
use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Assign badges with no organization to the default one.
 */
#[AsMessageHandler]
class ReassignOrganizationHandler
{
    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    public function __invoke(ReassignOrganization $reassignOrganization): void
    {
        $badges = $this->om->getRepository(BadgeClass::class)->findWithNoOrganization();

        foreach ($badges as $badge) {
            $badge->setIssuer($reassignOrganization->getOrganization());
            $this->om->persist($badge);
        }

        $this->om->flush();
    }
}
