<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Tests\Unit\Security;

use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\MindMeAiBundle\Security\SecretCipher;

class SecretCipherTest extends MockeryTestCase
{
    public function testRoundTrip(): void
    {
        $cipher = new SecretCipher('test-secret');

        $this->assertSame('sk-1234567890abcdef', $cipher->decrypt($cipher->encrypt('sk-1234567890abcdef')));
    }

    public function testEncryptedPayloadIsThreeBase64SegmentsAndHidesPlaintext(): void
    {
        $cipher = new SecretCipher('test-secret');

        $encoded = $cipher->encrypt('super-secret-value');

        $parts = explode(':', $encoded);
        $this->assertCount(3, $parts);

        foreach ($parts as $part) {
            $this->assertNotFalse(base64_decode($part, true));
        }

        $this->assertStringNotContainsString('super-secret-value', $encoded);
    }

    public function testTamperedCiphertextIsRejected(): void
    {
        $cipher = new SecretCipher('test-secret');

        $parts = explode(':', $cipher->encrypt('secret-value'));
        $cipherB64 = $parts[2];
        $parts[2] = ('A' === $cipherB64[0] ? 'B' : 'A').substr($cipherB64, 1);

        $this->expectException(\RuntimeException::class);
        $cipher->decrypt(implode(':', $parts));
    }

    public function testDifferentSecretCannotDecrypt(): void
    {
        $encoded = (new SecretCipher('secret-a'))->encrypt('secret-value');

        $this->expectException(\RuntimeException::class);
        (new SecretCipher('secret-b'))->decrypt($encoded);
    }

    public function testMalformedPayloadIsRejected(): void
    {
        $cipher = new SecretCipher('test-secret');

        $this->expectException(\RuntimeException::class);
        $cipher->decrypt('not-a-valid-encrypted-secret');
    }
}
