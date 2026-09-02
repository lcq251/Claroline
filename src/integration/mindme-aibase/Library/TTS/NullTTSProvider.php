<?php

namespace Mindme\AibaseBundle\Library\TTS;

use Mindme\AibaseBundle\Library\TTS\TTSProviderInterface;

/**
 * Placeholder TTS provider used until a real engine is configured.
 *
 * The resource player must degrade gracefully (silent text-only chat) when no
 * provider is available — this is the default deployment state.
 */
class NullTTSProvider implements TTSProviderInterface
{
    public function getName(): string
    {
        return 'null';
    }

    public function isAvailable(): bool
    {
        return false;
    }

    public function synthesize(string $text, array $options = []): array
    {
        return [
            'available' => false,
            'error' => 'tts_not_configured',
        ];
    }
}
