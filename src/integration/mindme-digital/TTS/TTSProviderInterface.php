<?php

namespace Mindme\DigitalBundle\TTS;

/**
 * Text-to-speech provider contract for the digital teacher.
 *
 * Implementations translate a provider (cloud / edge / self-hosted) into a
 * normalized result so the resource player can render audio uniformly.
 */
interface TTSProviderInterface
{
    public function getName(): string;

    public function isAvailable(): bool;

    /**
     * @param array<string, mixed> $options e.g. ['voice' => ..., 'rate' => 1.0, 'pitch' => 0.0]
     *
     * @return array{available: bool, content_type?: string, data?: string, error?: string, delay_ms?: int}
     */
    public function synthesize(string $text, array $options = []): array;
}
