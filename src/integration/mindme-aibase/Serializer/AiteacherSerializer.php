<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Mindme\AibaseBundle\Entity\Aiteacher;

/**
 * Serializes an Aiteacher (digital teacher) for the JSON API.
 *
 * The resource only carries the ai-avatar-bot widget configuration; the LLM
 * "brain" is referenced by brainAibaseId (an Aibase resource owns the model +
 * API key, which this serializer never exposes).
 */
class AiteacherSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return Aiteacher::class;
    }

    public function getName(): string
    {
        return 'aiteacher';
    }

    public function serialize(Aiteacher $aiteacher, array $options = []): array
    {
        return [
            'widgetBaseUrl' => $aiteacher->getWidgetBaseUrl(),
            'brainAibaseId' => $aiteacher->getBrainAibaseId(),
            'modelUrl' => $aiteacher->getModelUrl(),
            'voice' => $aiteacher->getVoice(),
            'mode' => $aiteacher->getMode(),
            'usageLimit' => $aiteacher->getUsageLimit(),
        ];
    }

    public function deserialize($data, Aiteacher $aiteacher, array $options = []): Aiteacher
    {
        $this->sipe('widgetBaseUrl', 'setWidgetBaseUrl', $data, $aiteacher);
        $this->sipe('modelUrl', 'setModelUrl', $data, $aiteacher);
        $this->sipe('voice', 'setVoice', $data, $aiteacher);
        $this->sipe('mode', 'setMode', $data, $aiteacher);

        if (array_key_exists('brainAibaseId', $data)) {
            $aiteacher->setBrainAibaseId(
                null === $data['brainAibaseId'] || '' === $data['brainAibaseId']
                    ? null
                    : (int) $data['brainAibaseId']
            );
        }

        if (array_key_exists('usageLimit', $data)) {
            $aiteacher->setUsageLimit(
                null === $data['usageLimit'] || '' === $data['usageLimit']
                    ? null
                    : (int) $data['usageLimit']
            );
        }

        return $aiteacher;
    }
}
