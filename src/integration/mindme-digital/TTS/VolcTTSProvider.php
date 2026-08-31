<?php

namespace Mindme\DigitalBundle\TTS;

use Mindme\DigitalBundle\TTS\TTSProviderInterface;

/**
 * Volcengine (火山引擎) Text-to-Speech provider.
 *
 * Implements the openSpeech /api/v1/tts HTTP protocol: submit -> poll(query)
 * -> merge audio chunks. Credentials (AppID + Access Token) come from the
 * DigitalTeacher resource, not from DI.
 *
 * NOTE: this follows the public volcano-speech TTS flow and is meant to be
 * calibrated against a real AppID/Token + the exact ResourceId of the enabled
 * product before production (response codes/field names may differ per service
 * type). Without credentials it fails fast (no request sent).
 */
class VolcTTSProvider implements TTSProviderInterface
{
    private const ENDPOINT = 'https://openspeech.bytedance.com/api/v1/tts';
    private const DEFAULT_VOICE = 'zh_female_cancan_mars_bigtts';
    private const RESOURCE_ID = 'volc.megatts.default';
    private const MAX_POLLS = 30;

    public function __construct(
        private readonly string $appId,
        private readonly string $token,
        private readonly int $timeout = 30
    ) {
    }

    public function getName(): string
    {
        return 'volc';
    }

    public function isAvailable(): bool
    {
        return '' !== $this->appId && '' !== $this->token;
    }

    public function synthesize(string $text, array $options = []): array
    {
        $text = trim($text);
        if ('' === $text) {
            return ['available' => false, 'error' => 'tts_empty_text'];
        }

        if ('' === $this->appId || '' === $this->token) {
            return ['available' => false, 'error' => 'tts_credential_missing'];
        }

        $voice = trim((string) ($options['voice'] ?? '')) ?: self::DEFAULT_VOICE;
        $speed = $options['rate'] ?? 1.0;
        $pitch = $options['pitch'] ?? 0.0;

        $reqId = self::uuid();
        $base = [
            'user' => ['uid' => 'claroline-digital-teacher'],
            'audio' => [
                'voice_type' => $voice,
                'encoding' => 'mp3',
                'speed_ratio' => (float) $speed,
                'pitch_ratio' => (float) $pitch,
                'volume_ratio' => 1.0,
            ],
            'request' => [
                'reqid' => $reqId,
                'text' => $text,
                'operation' => 'submit',
                'with_frontend' => 1,
                'frontend_type' => 'unitTson',
                'cut' => 5,
            ],
        ];

        $submit = $this->request($base, $this->requestId($reqId));
        if (empty($submit)) {
            return ['available' => false, 'error' => 'tts_request_failed'];
        }

        // Submit returns code 3000 on success and a `speaker` token for polling.
        if (3000 !== (int) ($submit['code'] ?? 0)) {
            return ['available' => false, 'error' => 'tts_volc_submit_failed'];
        }

        $speaker = (string) ($submit['speaker'] ?? '');
        $audio = '';

        for ($i = 0; $i < self::MAX_POLLS; ++$i) {
            $query = $this->request([
                'app' => $this->appPayload(),
                'user' => ['uid' => 'claroline-digital-teacher'],
                'request' => [
                    'reqid' => $reqId,
                    'speaker' => $speaker,
                    'operation' => 'query',
                ],
            ], $this->requestId($reqId));

            if (empty($query)) {
                return ['available' => false, 'error' => 'tts_volc_query_failed'];
            }

            if (isset($query['data']) && is_string($query['data'])) {
                $audio .= (string) base64_decode($query['data'], true);
            }

            $status = (int) ($query['status'] ?? 0);
            if (2 === $status) {
                return ['available' => false, 'error' => 'tts_volc_error'];
            }
            if (1 === $status) {
                break;
            }

            usleep(200_000);
        }

        if ('' === $audio) {
            return ['available' => false, 'error' => 'tts_synthesis_failed'];
        }

        return [
            'available' => true,
            'content_type' => 'audio/mpeg',
            'data' => $audio,
        ];
    }

    private function appPayload(): array
    {
        return [
            'appid' => $this->appId,
            'token' => 'access_token',
            'cluster' => 'volcano_tts',
        ];
    }

    private function request(array $payload, string $requestId): array
    {
        $ch = curl_init(self::ENDPOINT);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'X-Api-App-Key: '.$this->appId,
                'X-Api-Access-Key: '.$this->token,
                'X-Api-Resource-Id: '.self::RESOURCE_ID,
                'X-Api-Request-Id: '.$requestId,
                'X-Api-No-Comped: true',
                'X-Api-Connect-Time: 1',
            ],
        ]);

        $raw = curl_exec($ch);
        curl_close($ch);

        if (false === $raw) {
            return [];
        }

        $decoded = json_decode((string) $raw, true);

        return is_array($decoded) ? $decoded : [];
    }

    private function requestId(string $reqId): string
    {
        return rtrim(strtr(base64_encode($reqId.':'.microtime(true)), '+/', '-_'), '=');
    }

    private static function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
