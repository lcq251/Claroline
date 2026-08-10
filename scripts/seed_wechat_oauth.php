<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*
 * Idempotent seeding of the WeChat Open Platform OAuth2 client.
 *
 * Reads WECHAT_APP_ID / WECHAT_APP_SECRET from the environment (or argv)
 * and upserts the corresponding row in claro_authentication_oauth
 * (serviceProvider = 'wechat'), enabling the QR-code login button.
 *
 * Usage (inside the app container, as www-data):
 *   WECHAT_APP_ID=... WECHAT_APP_SECRET=... php scripts/seed_wechat_oauth.php
 *   php scripts/seed_wechat_oauth.php <app_id> <app_secret>
 *
 * Safe to run multiple times: it updates the existing row instead of
 * creating duplicates.
 */

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AuthenticationBundle\Entity\OAuthClient;
use Claroline\KernelBundle\Kernel;

require dirname(__DIR__).'/vendor/autoload.php';
require dirname(__DIR__).'/config/bootstrap.php';

$appId = getenv('WECHAT_APP_ID') ?: ($_ENV['WECHAT_APP_ID'] ?? ($argv[1] ?? null));
$secret = getenv('WECHAT_APP_SECRET') ?: ($_ENV['WECHAT_APP_SECRET'] ?? ($argv[2] ?? null));

if (empty($appId) || empty($secret)) {
    fwrite(STDERR, "Missing credentials. Set WECHAT_APP_ID / WECHAT_APP_SECRET or pass them as argv.\n");

    exit(1);
}

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

/** @var ObjectManager $om */
$om = $kernel->getContainer()->get(ObjectManager::class);

$repository = $om->getRepository(OAuthClient::class);

// Idempotent lookup: only one wechat client may exist.
$client = $repository->findOneBy(['serviceProvider' => 'wechat']);
$created = false;

if (empty($client)) {
    $client = new OAuthClient();
    $client->setServiceProvider('wechat');
    $client->refreshUuid();
    $created = true;
}

$client->setName('WeChat');
$client->setClientId($appId);
$client->setClientSecret($secret);
$client->setCreateOnLogin(true);
$client->setButtonDisplayed(true);
$client->setDisabled(false);

$om->persist($client);
$om->flush();

$kernel->shutdown();

echo ($created ? 'Created' : 'Updated')." wechat OAuth client (id: {$client->getClientId()})\n";
