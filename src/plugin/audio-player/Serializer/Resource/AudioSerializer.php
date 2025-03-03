<?php

namespace Claroline\AudioPlayerBundle\Serializer\Resource;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AudioPlayerBundle\Entity\Resource\Audio;

class AudioSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return Audio::class;
    }

    public function serialize(Audio $audio, array $options = []): array
    {
        return [
            'id' => $audio->getUuid(),
            'url' => $audio->getUrl(),
            'sectionsType' => $audio->getSectionsType(),
            'rateControl' => $audio->getRateControl(),
            'description' => $audio->getDescription(),
        ];
    }

    public function deserialize(array $data, Audio $audio, array $options = []): Audio
    {
        $this->sipe('url', 'setUrl', $data, $audio);
        $this->sipe('sectionsType', 'setSectionsType', $data, $audio);
        $this->sipe('rateControl', 'setRateControl', $data, $audio);
        $this->sipe('description', 'setDescription', $data, $audio);

        return $audio;
    }
}
