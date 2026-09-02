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
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Mindme\AibaseBundle\Entity\Aibase;
use Mindme\AibaseBundle\Library\SecretCipher;

/**
 * Serializes an Aibase (AI model resource) for the JSON API.
 *
 * Security boundary: the stored apiKey is NEVER exposed. The API only
 * returns `hasKey` (bool) and `apiKeyMask` (•••••• when a key exists).
 * On deserialize, a non-empty, non-mask apiKey is encrypted with
 * SecretCipher before being persisted.
 *
 * is_default uniqueness: setting a resource as default unmarks every other
 * (platform-wide single default).
 */
class AibaseSerializer
{
    use SerializerTrait;

    public const MASK = '••••••';

    public function __construct(
        private readonly ObjectManager $om,
        private readonly SecretCipher $cipher
    ) {
    }

    public function getClass(): string
    {
        return Aibase::class;
    }

    public function getName(): string
    {
        return 'aibase';
    }

    public function serialize(Aibase $aibase, array $options = []): array
    {
        $hasKey = null !== $aibase->getApiKey();

        return [
            'modelName' => $aibase->getModelName(),
            'expiresAt' => DateNormalizer::normalize($aibase->getExpiresAt()),
            'isDefault' => $aibase->isDefault(),
            'usageLimit' => $aibase->getUsageLimit(),
            'restrictionType' => $aibase->getRestrictionType(),
            'startAt' => DateNormalizer::normalize($aibase->getStartAt()),
            'platformType' => $aibase->getPlatformType(),
            'baseUrl' => $aibase->getBaseUrl(),
            'extraConfig' => null !== $aibase->getExtraConfig() ? json_encode($aibase->getExtraConfig()) : null,
            'kind' => $aibase->getKind(),
            'ttsEngine' => $aibase->getTtsEngine(),
            'voiceId' => $aibase->getVoiceId(),
            'rate' => $aibase->getRate(),
            'pitch' => $aibase->getPitch(),
            'avatarType' => $aibase->getAvatarType(),
            'avatarAsset' => $aibase->getAvatarAsset(),
            'hasTtsToken' => null !== $aibase->getTtsToken(),
            'hasKey' => $hasKey,
            'apiKeyMask' => $hasKey ? self::MASK : '',
        ];
    }

    public function deserialize($data, Aibase $aibase, array $options = []): Aibase
    {
        $this->sipe('modelName', 'setModelName', $data, $aibase);

        if (isset($data['kind'])) {
            $kind = $data['kind'];
            $aibase->setKind(in_array($kind, ['model', 'digital_teacher'], true) ? $kind : 'model');
        }

        if (isset($data['platformType'])) {
            $allowed = array_keys(Aibase::platformDefaults());
            $allowed[] = 'custom';
            $pt = $data['platformType'];
            $aibase->setPlatformType(in_array($pt, $allowed, true) ? $pt : null);
        }

        if (isset($data['baseUrl'])) {
            $aibase->setBaseUrl('' === (string) $data['baseUrl'] ? null : trim((string) $data['baseUrl']));
        }

        if (array_key_exists('extraConfig', $data)) {
            $cfg = null;
            if (is_array($data['extraConfig'])) {
                $cfg = $data['extraConfig'];
            } elseif (is_string($data['extraConfig']) && '' !== trim($data['extraConfig'])) {
                $decoded = json_decode(trim($data['extraConfig']), true);
                $cfg = is_array($decoded) ? $decoded : null;
            }
            $aibase->setExtraConfig($cfg);
        }

        if (isset($data['expiresAt'])) {
            $expiresAt = null;

            if (!empty($data['expiresAt'])) {
                $expiresAt = DateNormalizer::denormalize($data['expiresAt']) ?? new \DateTime($data['expiresAt']);
            }

            $aibase->setExpiresAt($expiresAt);
        }

        if (array_key_exists('usageLimit', $data)) {
            // empty/null clears the resource limit -> platform fallback
            $aibase->setUsageLimit(null === $data['usageLimit'] || '' === $data['usageLimit']
                ? null
                : (int) $data['usageLimit']);
        }

        if (isset($data['restrictionType'])) {
            $rt = $data['restrictionType'];
            $aibase->setRestrictionType(in_array($rt, ['none', 'time', 'count'], true) ? $rt : null);
        }

        if (isset($data['startAt'])) {
            $startAt = null;
            if (!empty($data['startAt'])) {
                $startAt = DateNormalizer::denormalize($data['startAt']) ?? new \DateTime($data['startAt']);
            }
            $aibase->setStartAt($startAt);
        }

        if (isset($data['isDefault'])) {
            $isDefault = (bool) $data['isDefault'];

            if ($isDefault && !$aibase->isDefault()) {
                // unmark any other default resource (single platform default)
                foreach ($this->om->getRepository(Aibase::class)->findBy(['isDefault' => true]) as $other) {
                    if ($other !== $aibase) {
                        $other->setIsDefault(false);
                    }
                }
            }

            $aibase->setIsDefault($isDefault);
        }

        if (isset($data['apiKey'])) {
            $apiKey = trim((string) $data['apiKey']);

            // only a non-empty, non-mask value replaces the stored key
            if ('' !== $apiKey && self::MASK !== $apiKey) {
                $aibase->setApiKey($this->cipher->encrypt($apiKey));
            }
        }

        if (isset($data['ttsEngine'])) {
            $engine = $data['ttsEngine'];
            $aibase->setTtsEngine(in_array($engine, ['none', 'cloud', 'volc', 'edge', 'selfhosted'], true) ? $engine : null);
        }

        $this->sipe('voiceId', 'setVoiceId', $data, $aibase);
        $this->sipe('rate', 'setRate', $data, $aibase);
        $this->sipe('pitch', 'setPitch', $data, $aibase);
        $this->sipe('avatarType', 'setAvatarType', $data, $aibase);
        $this->sipe('avatarAsset', 'setAvatarAsset', $data, $aibase);
        $this->sipe('ttsAppId', 'setTtsAppId', $data, $aibase);

        if (isset($data['ttsToken'])) {
            $ttsToken = trim((string) $data['ttsToken']);

            if ('' !== $ttsToken && self::MASK !== $ttsToken) {
                $aibase->setTtsToken($this->cipher->encrypt($ttsToken));
            }
        }

        return $aibase;
    }
}