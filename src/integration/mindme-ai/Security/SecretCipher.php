<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Security;

/**
 * Authenticated encryption of secrets (AI API keys) at rest.
 *
 * The master key is derived from the platform's kernel.secret (APP_SECRET)
 * via SHA-256, producing a 32-byte AES-256 key. Each payload is encrypted
 * with AES-256-GCM (random IV + authentication tag), so any tampering of
 * the stored ciphertext fails decryption with a RuntimeException.
 *
 * Storage format (single text column): base64(iv):base64(tag):base64(ciphertext)
 *
 * ⚠️ APP_SECRET is a long-term key: rotating it invalidates every stored
 * ciphertext. Never log or echo the secret or the decrypted values.
 */
class SecretCipher
{
    private const CIPHER = 'aes-256-gcm';

    private readonly string $key;

    public function __construct(string $secret)
    {
        // SHA-256 of the platform secret → 32 bytes = AES-256 key material
        $this->key = hash('sha256', $secret, true);
    }

    public function encrypt(string $plain): string
    {
        $iv = random_bytes(openssl_cipher_iv_length(self::CIPHER));
        $tag = '';

        $ciphertext = openssl_encrypt(
            $plain,
            self::CIPHER,
            $this->key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if (false === $ciphertext) {
            throw new \RuntimeException('Secret encryption failed.');
        }

        return implode(':', [
            base64_encode($iv),
            base64_encode($tag),
            base64_encode($ciphertext),
        ]);
    }

    public function decrypt(string $cipher): string
    {
        $parts = explode(':', $cipher, 3);

        if (3 !== count($parts)) {
            throw new \RuntimeException('Malformed encrypted secret.');
        }

        [$ivB64, $tagB64, $cipherB64] = $parts;

        $plain = openssl_decrypt(
            base64_decode($cipherB64),
            self::CIPHER,
            $this->key,
            OPENSSL_RAW_DATA,
            base64_decode($ivB64),
            base64_decode($tagB64)
        );

        if (false === $plain) {
            throw new \RuntimeException('Secret decryption failed (tampered or invalid key).');
        }

        return $plain;
    }
}
