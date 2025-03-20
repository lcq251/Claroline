<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class AssertionSerializer
{
    public function __construct(
        private readonly AuthorizationCheckerInterface $authorization,
        private readonly UserSerializer $userSerializer,
        private readonly BadgeClassSerializer $badgeSerializer
    ) {
    }

    public function getName(): string
    {
        return 'open_badge_assertion';
    }

    public function getClass(): string
    {
        return Assertion::class;
    }

    public function serialize(Assertion $assertion, array $options = []): array
    {
        $serialized = [
            'id' => $assertion->getUuid(),
            'user' => $this->userSerializer->serialize($assertion->getRecipient(), [SerializerInterface::SERIALIZE_MINIMAL]),
            'badge' => $this->badgeSerializer->serialize($assertion->getBadge(), [SerializerInterface::SERIALIZE_MINIMAL]),
            'issuedOn' => DateNormalizer::normalize($assertion->getIssuedOn()),
            'expires' => $this->getExpireDate($assertion),
        ];

        if (!in_array(SerializerInterface::SERIALIZE_MINIMAL, $options, true)) {
            $isAdmin = $this->authorization->isGranted('ADMINISTRATE', $assertion);

            $serialized['permissions'] = [
                'open' => $isAdmin || $this->authorization->isGranted('OPEN', $assertion),
                'administrate' => $isAdmin,
                'delete' => $isAdmin,
            ];
        }

        return $serialized;
    }

    private function getExpireDate(Assertion $assertion): string
    {
        $badge = $assertion->getBadge();
        $date = $assertion->getIssuedOn();
        $date->modify('+ '.$badge->getDurationValidation().' day');

        return $date->format('Y-m-d');
    }
}
