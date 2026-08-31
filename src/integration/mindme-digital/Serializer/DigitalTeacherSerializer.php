<?php

namespace Mindme\DigitalBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Mindme\DigitalBundle\Entity\DigitalTeacher;
use Mindme\DigitalBundle\Security\SecretCipher;

/**
 * Serializes a DigitalTeacher (AI personable resource) for the JSON API.
 *
 * Security boundary: the stored apiKey is NEVER exposed. The API only returns
 * `hasKey` and `apiKeyMask`. On deserialize, a non-empty, non-mask apiKey is
 * encrypted with SecretCipher before being persisted.
 *
 * No conversation history is serialized (the resource only carries config).
 */
class DigitalTeacherSerializer
{
    use SerializerTrait;

    public const MASK = '••••••';

    public function __construct(private readonly SecretCipher $cipher)
    {
    }

    public function getClass(): string
    {
        return DigitalTeacher::class;
    }

    public function getName(): string
    {
        return 'digital_teacher';
    }

    public function serialize(DigitalTeacher $teacher, array $options = []): array
    {
        $hasKey = null !== $teacher->getApiKey();

        return [
            'modelName' => $teacher->getModelName(),
            'expiresAt' => DateNormalizer::normalize($teacher->getExpiresAt()),
            'usageLimit' => $teacher->getUsageLimit(),
            'restrictionType' => $teacher->getRestrictionType(),
            'startAt' => DateNormalizer::normalize($teacher->getStartAt()),
            'ttsEngine' => $teacher->getTtsEngine(),
            'voiceId' => $teacher->getVoiceId(),
            'rate' => $teacher->getRate(),
            'pitch' => $teacher->getPitch(),
            'avatarType' => $teacher->getAvatarType(),
            'avatarAsset' => $teacher->getAvatarAsset(),
            'ttsAppId' => $teacher->getTtsAppId(),
            'apiBaseUrl' => $teacher->getApiBaseUrl(),
            'hasTtsToken' => null !== $teacher->getTtsToken(),
            'hasKey' => $hasKey,
            'apiKeyMask' => $hasKey ? self::MASK : '',
        ];
    }

    public function deserialize($data, DigitalTeacher $teacher, array $options = []): DigitalTeacher
    {
        $this->sipe('modelName', 'setModelName', $data, $teacher);
        $this->sipe('ttsEngine', 'setTtsEngine', $data, $teacher);
        $this->sipe('voiceId', 'setVoiceId', $data, $teacher);
        $this->sipe('rate', 'setRate', $data, $teacher);
        $this->sipe('pitch', 'setPitch', $data, $teacher);
        $this->sipe('avatarType', 'setAvatarType', $data, $teacher);
        $this->sipe('avatarAsset', 'setAvatarAsset', $data, $teacher);

        if (isset($data['expiresAt'])) {
            $expiresAt = null;

            if (!empty($data['expiresAt'])) {
                $expiresAt = DateNormalizer::denormalize($data['expiresAt']) ?? new \DateTime($data['expiresAt']);
            }

            $teacher->setExpiresAt($expiresAt);
        }

        if (array_key_exists('usageLimit', $data)) {
            $teacher->setUsageLimit(null === $data['usageLimit'] || '' === $data['usageLimit']
                ? null
                : (int) $data['usageLimit']);
        }

        if (isset($data['restrictionType'])) {
            $rt = $data['restrictionType'];
            $teacher->setRestrictionType(in_array($rt, ['none', 'time', 'count'], true) ? $rt : null);
        }

        if (isset($data['startAt'])) {
            $startAt = null;

            if (!empty($data['startAt'])) {
                $startAt = DateNormalizer::denormalize($data['startAt']) ?? new \DateTime($data['startAt']);
            }

            $teacher->setStartAt($startAt);
        }

        if (isset($data['apiKey'])) {
            $apiKey = trim((string) $data['apiKey']);

            // only a non-empty, non-mask value replaces the stored key
            if ('' !== $apiKey && self::MASK !== $apiKey) {
                $teacher->setApiKey($this->cipher->encrypt($apiKey));
            }
        }

        $this->sipe('ttsAppId', 'setTtsAppId', $data, $teacher);

        if (array_key_exists('ttsToken', $data)) {
            $ttsToken = trim((string) $data['ttsToken']);

            if ('' !== $ttsToken && self::MASK !== $ttsToken) {
                $teacher->setTtsToken($ttsToken);
            }
        }

        return $teacher;
    }
}
