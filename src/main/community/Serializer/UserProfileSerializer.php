<?php

namespace Claroline\CommunityBundle\Serializer;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Entity\UserProfile;
use Claroline\CoreBundle\API\Serializer\Facet\PanelFacetSerializer;
use Claroline\CoreBundle\Entity\Facet\PanelFacet;

class UserProfileSerializer
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly PanelFacetSerializer $panelFacetSerializer
    ) {
    }

    public function getName(): string
    {
        return 'user_profile';
    }

    public function getClass(): string
    {
        return UserProfile::class;
    }

    public function serialize(UserProfile $userProfile, ?array $options = []): array
    {
        return [
            'sections' => array_map(function (PanelFacet $section) {
                return $this->panelFacetSerializer->serialize($section);
            }, $userProfile->getSections()->toArray()),
        ];
    }

    public function deserialize(array $data, UserProfile $userProfile, ?array $options = []): ?UserProfile
    {
        if (array_key_exists('sections', $data)) {
            $sectionIds = [];
            foreach ($data['sections'] as $section) {
                // check if section exists first
                $panelFacet = $this->om->getObject($section, PanelFacet::class) ?? new PanelFacet();
                $this->panelFacetSerializer->deserialize($section, $panelFacet, $options);

                $userProfile->addSection($panelFacet);
                $sectionIds[] = $panelFacet->getUuid();
            }

            foreach ($userProfile->getSections() as $panelFacet) {
                if (!in_array($panelFacet->getUuid(), $sectionIds)) {
                    $userProfile->removeSection($panelFacet);
                }
            }
        }

        return $userProfile;
    }
}
