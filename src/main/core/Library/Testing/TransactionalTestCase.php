<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Testing;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class TransactionalTestCase extends WebTestCase
{
    /** @var TransactionalTestClient */
    protected $client;

    protected function setUp(): void
    {
        parent::setUp();
        self::ensureKernelShutdown();
        $this->client = self::createClient();
        $this->client->disableReboot();
        $this->client->getContainer()->get('Claroline\AppBundle\Persistence\ObjectManager')->beginTransaction();
    }

    protected function tearDown(): void
    {
        // we can't simply do "$client->shutdown()" because sometimes
        // when an integration test fails (e.g. due to an error in the
        // container configuration) the $client property is set to null
        // (by PHPUnit?) and the original error is hidden behind a fatal
        // "Call to a member function shutdown() on a non-object"...
        if ($this->client instanceof TransactionalTestClient) {
            $this->client->getContainer()->get('Claroline\AppBundle\Persistence\ObjectManager')->rollback();
        }

        // the following helps to free memory and speed up test suite execution.
        // see http://kriswallsmith.net/post/18029585104/faster-phpunit
        $refl = new \ReflectionObject($this);

        foreach ($refl->getProperties() as $prop) {
            if (!$prop->isStatic() && 0 !== strpos($prop->getDeclaringClass()->getName(), 'PHPUnit_')) {
                $prop->setAccessible(true);
                $prop->setValue($this, null);
            }
        }

        parent::tearDown();
    }
}
