<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Security\SecretCipher;

/**
 * Serializes an AiLesson (AI model resource) for the JSON API (C-24).
 *
 * Security boundary: the stored apiKey is NEVER exposed. The API only
 * returns `hasKey` (bool) and `apiKeyMask` (•••••• when a key exists).
 * On deserialize, a non-empty, non-mask apiKey is encrypted with
 * SecretCipher before being persisted; empty/mask keeps the stored key.
 *
 * is_default uniqueness: setting a lesson as default unmarks every other
 * lesson (platform-wide single default).
 */
class AiLessonSerializer
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
        return AiLesson::class;
    }

    public function getName(): string
    {
        return 'ai_lesson';
    }

    public function serialize(AiLesson $lesson, array $options = []): array
    {
        $hasKey = null !== $lesson->getApiKey();

        return [
            'modelName' => $lesson->getModelName(),
            'expiresAt' => DateNormalizer::normalize($lesson->getExpiresAt()),
            'isDefault' => $lesson->isDefault(),
            'usageLimit' => $lesson->getUsageLimit(),
            'hasKey' => $hasKey,
            'apiKeyMask' => $hasKey ? self::MASK : '',
        ];
    }

    public function deserialize($data, AiLesson $lesson, array $options = []): AiLesson
    {
        $this->sipe('modelName', 'setModelName', $data, $lesson);

        if (isset($data['expiresAt'])) {
            $expiresAt = null;

            if (!empty($data['expiresAt'])) {
                $expiresAt = DateNormalizer::denormalize($data['expiresAt']) ?? new \DateTime($data['expiresAt']);
            }

            $lesson->setExpiresAt($expiresAt);
        }

        if (array_key_exists('usageLimit', $data)) {
            // empty/null clears the resource limit -> platform fallback (mindme_ai.daily_limit)
            $lesson->setUsageLimit(null === $data['usageLimit'] || '' === $data['usageLimit']
                ? null
                : (int) $data['usageLimit']);
        }

        if (isset($data['isDefault'])) {
            $isDefault = (bool) $data['isDefault'];

            if ($isDefault && !$lesson->isDefault()) {
                // unmark any other default lesson (single platform default)
                foreach ($this->om->getRepository(AiLesson::class)->findBy(['isDefault' => true]) as $other) {
                    if ($other !== $lesson) {
                        $other->setIsDefault(false);
                    }
                }
            }

            $lesson->setIsDefault($isDefault);
        }

        if (isset($data['apiKey'])) {
            $apiKey = trim((string) $data['apiKey']);

            // only a non-empty, non-mask value replaces the stored key
            if ('' !== $apiKey && self::MASK !== $apiKey) {
                $lesson->setApiKey($this->cipher->encrypt($apiKey));
            }
        }

        return $lesson;
    }
}
