<?php

namespace Mindme\DigitalBundle\TTS;

use Mindme\DigitalBundle\TTS\TTSProviderInterface;

/**
 * Edge-TTS provider (Microsoft Edge "read-aloud" voices, free).
 *
 * Synthesis is delegated to the community-maintained `edge-tts` Python CLI,
 * which keeps tracking Microsoft's WebSocket/Sec-MS-GEC protocol changes so
 * this PHP class stays a thin process wrapper instead of maintaining a fragile
 * protocol implementation.
 *
 * Deployment prerequisite (on the PHP host):
 *   pip install edge-tts     (provides `python3 -m edge_tts`)
 * plus network egress to speech.platform.bing.com.
 *
 * rate range: roughly -50% .. +100%; pitch range: -50Hz .. +50Hz.
 */
class EdgeTTSProvider implements TTSProviderInterface
{
    private const DEFAULT_VOICE = 'zh-CN-XiaoxiaoNeural';

    public function __construct(
        private readonly string $command = 'python3',
        private readonly int $timeout = 60
    ) {
    }

    public function getName(): string
    {
        return 'edge';
    }

    public function isAvailable(): bool
    {
        // Real availability is only known once we try; the CLI may be absent.
        return true;
    }

    public function synthesize(string $text, array $options = []): array
    {
        $text = trim($text);
        if ('' === $text) {
            return ['available' => false, 'error' => 'tts_empty_text'];
        }

        $voice = trim((string) ($options['voice'] ?? '')) ?: self::DEFAULT_VOICE;
        $rate = $this->rateString(isset($options['rate']) ? (float) $options['rate'] : null);
        $pitch = $this->pitchString(isset($options['pitch']) ? (float) $options['pitch'] : null);

        // Write to a temp file (not stdout) so we can detect partial failures.
        $out = tempnam(sys_get_temp_dir(), 'edge_tts').'.mp3';
        $descriptors = [
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ];

        $cmd = [
            $this->command, '-m', 'edge_tts',
            '--text', $text,
            '--voice', $voice,
            '--rate', $rate,
            '--pitch', $pitch,
            '--write-media', $out,
        ];

        $proc = proc_open($cmd, $descriptors, $pipes);
        if (!is_resource($proc)) {
            return ['available' => false, 'error' => 'tts_process_failed'];
        }

        $stderr = stream_get_contents($pipes[2]);
        fclose($pipes[1]);
        fclose($pipes[2]);

        $exit = proc_close($proc);

        if (0 !== $exit || !is_file($out) || filesize($out) < 100) {
            @unlink($out);

            return [
                'available' => false,
                'error' => str_contains((string) $stderr, 'ModuleNotFoundError')
                    ? 'tts_cli_missing'
                    : 'tts_synthesis_failed',
            ];
        }

        $data = (string) file_get_contents($out);
        @unlink($out);

        if ('' === $data) {
            return ['available' => false, 'error' => 'tts_synthesis_failed'];
        }

        return [
            'available' => true,
            'content_type' => 'audio/mpeg',
            'data' => $data,
        ];
    }

    private function rateString(?float $rate): string
    {
        if (null === $rate) {
            return '+0%';
        }

        $pct = (int) round(($rate - 1.0) * 100);
        $pct = max(-100, min(100, $pct));

        return ($pct >= 0 ? '+' : '').$pct.'%';
    }

    private function pitchString(?float $pitch): string
    {
        if (null === $pitch) {
            return '0Hz';
        }

        $hz = (int) round($pitch * 100);
        $hz = max(-50, min(50, $hz));

        return ($hz >= 0 ? '+' : '').$hz.'Hz';
    }
}
