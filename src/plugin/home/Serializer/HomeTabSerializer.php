<?php

namespace Claroline\HomeBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Serializer\RoleSerializer;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Library\Normalizer\DateRangeNormalizer;
use Claroline\HomeBundle\Entity\HomeTab;
use Claroline\HomeBundle\Entity\Type\AbstractTab;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\String\Slugger\AsciiSlugger;

class HomeTabSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly AuthorizationCheckerInterface $authorization,
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer,
        private readonly WorkspaceSerializer $workspaceSerializer,
        private readonly UserSerializer $userSerializer,
        private readonly RoleSerializer $roleSerializer
    ) {
    }

    public function getName(): string
    {
        return 'home_tab';
    }

    public function getClass(): string
    {
        return HomeTab::class;
    }

    public function serialize(HomeTab $homeTab, array $options = []): array
    {
        $data = [
            'id' => $homeTab->getUuid(),
            'title' => $homeTab->getName(),
            'slug' => $homeTab->getLongTitle() ? (new AsciiSlugger())->slug($homeTab->getLongTitle()) : 'new',
            'longTitle' => $homeTab->getLongTitle(),
            'poster' => $homeTab->getPoster(),
            'icon' => $homeTab->getIcon(),
            'type' => $homeTab->getType(),
            'class' => $homeTab->getClass(),
            'meta' => [
                'views' => $homeTab->getViews(),
            ],
            'position' => $homeTab->getOrder(),
            'permissions' => [
                'open' => $this->authorization->isGranted('OPEN', $homeTab),
                'edit' => $this->authorization->isGranted('EDIT', $homeTab),
                'delete' => $this->authorization->isGranted('DELETE', $homeTab),
            ],
            'restrictions' => [
                'hidden' => $homeTab->isHidden(),
                'dates' => DateRangeNormalizer::normalize(
                    $homeTab->getAccessibleFrom(),
                    $homeTab->getAccessibleUntil()
                ),
                'code' => $homeTab->getAccessCode(),
                'roles' => array_map(function (Role $role) {
                    return $this->roleSerializer->serialize($role, [Options::SERIALIZE_MINIMAL]);
                }, $homeTab->getRoles()->toArray()),
            ],
            'children' => array_map(function (HomeTab $child) use ($options) {
                return $this->serialize($child, $options);
            }, $homeTab->getChildren()->toArray()),
        ];

        return $data;
    }

    public function deserialize(array $data, HomeTab $homeTab, array $options = []): HomeTab
    {
        if (!in_array(Options::REFRESH_UUID, $options)) {
            $this->deserializeProperty($data, 'id', 'setUuid', $homeTab);
        } else {
            $homeTab->refreshUuid();
        }

        $this->deserializeProperty($data, 'title', 'setName', $homeTab);
        $this->deserializeProperty($data, 'position', 'setOrder', $homeTab);
        $this->deserializeProperty($data, 'longTitle', 'setLongTitle', $homeTab);
        $this->deserializeProperty($data, 'poster', 'setPoster', $homeTab);
        $this->deserializeProperty($data, 'icon', 'setIcon', $homeTab);
        $this->deserializeProperty($data, 'type', 'setType', $homeTab);
        $this->deserializeProperty($data, 'class', 'setClass', $homeTab);

        if (isset($data['restrictions'])) {
            $this->deserializeProperty($data, 'restrictions.hidden', 'setHidden', $homeTab);
        }

        return $homeTab;
    }
}
