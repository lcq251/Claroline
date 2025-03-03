<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AudioPlayerBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AudioPlayerBundle\Entity\Resource\Audio;
use Claroline\AudioPlayerBundle\Entity\Resource\Section;
use Claroline\AudioPlayerBundle\Entity\Resource\SectionComment;
use Claroline\AudioPlayerBundle\Serializer\Resource\SectionSerializer;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Doctrine\Persistence\ObjectRepository;

class AudioPlayerManager
{
    private ObjectRepository $sectionRepo;
    private ObjectRepository $sectionCommentRepo;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly SectionSerializer $sectionSerializer
    ) {
        $this->sectionRepo = $om->getRepository(Section::class);
        $this->sectionCommentRepo = $om->getRepository(SectionComment::class);
    }

    public function deserializeSections(ResourceNode $resourceNode, ?array $data = []): void
    {
        $sections = $this->getManagerSections($resourceNode);
        $sectionsArray = [];
        $newSectionsIds = [];

        foreach ($sections as $section) {
            $sectionsArray[$section->getUuid()] = $section;
        }
        if (isset($data['sections'])) {
            foreach ($data['sections'] as $sectionData) {
                $section = null;

                if (isset($sectionsArray[$sectionData['id']])) {
                    $section = $sectionsArray[$sectionData['id']];
                } else {
                    $section = new Section();
                    $section->setResourceNode($resourceNode);
                }
                $section = $this->sectionSerializer->deserialize($sectionData, $section);
                $newSectionsIds[] = $section->getUuid();
                $this->om->persist($section);
            }
        }
        foreach ($sectionsArray as $uuid => $section) {
            if (!in_array($uuid, $newSectionsIds)) {
                $this->om->remove($section);
            }
        }
    }

    public function getManagerSections(ResourceNode $resourceNode): array
    {
        return $this->sectionRepo->findBy(['resourceNode' => $resourceNode, 'type' => Audio::MANAGER_TYPE]);
    }

    public function getUserSections(ResourceNode $resourceNode, User $user): array
    {
        return $this->sectionRepo->findBy([
            'resourceNode' => $resourceNode,
            'type' => Audio::USER_TYPE,
            'user' => $user,
        ]);
    }

    public function getSectionUserComment(Section $section, User $user): ?SectionComment
    {
        return $this->sectionCommentRepo->findOneBy(['section' => $section, 'user' => $user]);
    }
}
