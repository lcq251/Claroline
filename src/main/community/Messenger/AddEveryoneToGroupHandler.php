<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CommunityBundle\Messenger;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Messenger\Message\AddEveryoneToGroup;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\User;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class AddEveryoneToGroupHandler
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly Crud $crud
    ) {
    }

    public function __invoke(AddEveryoneToGroup $message): void
    {
        $group = $this->om->getRepository(Group::class)->find($message->getGroupId());
        if (empty($group)) {
            return;
        }

        $users = $this->om->getRepository(User::class)->findByOrganization($group->getOrganization());

        $this->om->startFlushSuite();
        foreach ($users as $index => $user) {
            $this->crud->patch($group, 'user', Crud::COLLECTION_ADD, [$user]);
            if (0 === $index % 100) {
                $this->om->flush();
            }
        }
        $this->om->endFlushSuite();
    }
}
