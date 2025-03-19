<?php

namespace Claroline\ClacoFormBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\ClacoFormBundle\Entity\EntryUser;
use Claroline\CommunityBundle\Serializer\UserSerializer;

class EntryUserSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly UserSerializer $userSerializer
    ) {
    }

    public function getName(): string
    {
        return 'clacoform_entry_user';
    }

    public function getClass(): string
    {
        return EntryUser::class;
    }

    public function serialize(EntryUser $entryUser, array $options = []): array
    {
        return [
            'id' => $entryUser->getUuid(),
            'user' => $this->userSerializer->serialize($entryUser->getUser(), [SerializerInterface::SERIALIZE_MINIMAL]),
            'shared' => $entryUser->isShared(),
            'notifyEdition' => $entryUser->getNotifyEdition(),
        ];
    }

    public function deserialize(array $data, EntryUser $entryUser, array $options = []): EntryUser
    {
        $this->sipe('id', 'setUuid', $data, $entryUser);
        $this->sipe('shared', 'setShared', $data, $entryUser);
        $this->sipe('notifyEdition', 'setNotifyEdition', $data, $entryUser);

        return $entryUser;
    }
}
