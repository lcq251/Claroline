<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Serializer\Registration;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\CursusBundle\Entity\Registration\AbstractUserRegistration;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

abstract class AbstractUserSerializer
{
    use SerializerTrait;

    private AuthorizationCheckerInterface $authorization;
    private UserSerializer $userSerializer;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        UserSerializer $userSerializer,
    ) {
        $this->userSerializer = $userSerializer;
        $this->authorization = $authorization;
    }

    public function serialize(AbstractUserRegistration $userRegistration, array $options = []): array
    {
        $serialized = [
            'id' => $userRegistration->getUuid(),
            'type' => $userRegistration->getType(),
            'validated' => $userRegistration->isValidated(),
            'confirmed' => $userRegistration->isConfirmed(),
            'date' => DateNormalizer::normalize($userRegistration->getDate()),
            'user' => $this->userSerializer->serialize($userRegistration->getUser(), [SerializerInterface::SERIALIZE_MINIMAL]),
        ];

        if (!in_array(SerializerInterface::SERIALIZE_TRANSFER, $options)) {
            $isAdmin = $this->authorization->isGranted('ADMINISTRATE', $userRegistration);
            $serialized['permissions'] = [
                'open' => $isAdmin || $this->authorization->isGranted('OPEN', $userRegistration),
                'edit' => $isAdmin || $this->authorization->isGranted('EDIT', $userRegistration),
                'administrate' => $isAdmin,
            ];
        }

        return $serialized;
    }

    public function deserialize(array $data, AbstractUserRegistration $userRegistration, ?array $options = []): AbstractUserRegistration
    {
        if (!in_array(SerializerInterface::REFRESH_UUID, $options)) {
            $this->sipe('id', 'setUuid', $data, $userRegistration);
        }

        $this->sipe('id', 'setUuid', $data, $userRegistration);
        $this->sipe('type', 'setType', $data, $userRegistration);
        $this->sipe('validated', 'setValidated', $data, $userRegistration);
        $this->sipe('confirmed', 'setConfirmed', $data, $userRegistration);

        if (isset($data['date'])) {
            $userRegistration->setDate(DateNormalizer::denormalize($data['date']));
        }

        return $userRegistration;
    }
}
