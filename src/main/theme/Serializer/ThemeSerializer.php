<?php

namespace Claroline\ThemeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\ThemeBundle\Entity\Theme;

class ThemeSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return Theme::class;
    }

    public function serialize(Theme $theme): array
    {
        return [
            'id' => $theme->getUuid(),
            'name' => $theme->getName(),
            'normalizedName' => $theme->getNormalizedName(),
            'disabled' => $theme->isDisabled(),
            'default' => $theme->isDefault(),

            'logo' => $theme->getLogo(),
            'primaryColor' => $theme->getPrimaryColor(),
            'secondaryColor' => $theme->getSecondaryColor(),

            'themeMode' => $theme->getThemeMode(),
            'fontSize' => $theme->getFontSize(),
            'fontWeight' => $theme->getFontWeight(),
            'striped' => $theme->isStriped(),
        ];
    }

    public function deserialize(array $data, Theme $theme): Theme
    {
        // meta
        $this->sipe('id', 'setUuid', $data, $theme);
        $this->sipe('name', 'setName', $data, $theme);

        $this->sipe('default', 'setDefault', $data, $theme);
        $this->sipe('disabled', 'setDisabled', $data, $theme);

        // params
        $this->sipe('logo', 'setLogo', $data, $theme);
        $this->sipe('primaryColor', 'setPrimaryColor', $data, $theme);
        $this->sipe('secondaryColor', 'setSecondaryColor', $data, $theme);

        $this->sipe('themeMode', 'setThemeMode', $data, $theme);
        $this->sipe('fontSize', 'setFontSize', $data, $theme);
        $this->sipe('fontWeight', 'setFontWeight', $data, $theme);
        $this->sipe('striped', 'setStriped', $data, $theme);

        return $theme;
    }
}
