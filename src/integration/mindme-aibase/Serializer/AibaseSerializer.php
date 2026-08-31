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
use Mindme\AibaseBundle\Security\SecretCipher;

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
            'hasKey' => $hasKey,
            'apiKeyMask' => $hasKey ? self::MASK : '',
        ];
    }

    public function deserialize($data, Aibase $aibase, array $options = []): Aibase
    {
        $this->sipe('modelName', 'setModelName', $data, $aibase);

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

        return $aibase;
    }
}