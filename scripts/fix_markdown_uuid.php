<?php
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\KernelBundle\Kernel;

require dirname(__DIR__).'/vendor/autoload.php';
require dirname(__DIR__).'/config/bootstrap.php';

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

/** @var ObjectManager $om */
$om = $kernel->getContainer()->get(ObjectManager::class);

// 1. ensure uuid column exists (idempotent via information_schema check)
$hasUuid = (bool) $om->getConnection()->fetchOne(
    "SELECT COUNT(*) FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'claro_mindme_markdown' AND COLUMN_NAME = 'uuid'"
);

$conn = $om->getConnection();
if (!$hasUuid) {
    $conn->executeStatement('ALTER TABLE claro_mindme_markdown ADD COLUMN uuid VARCHAR(36) NULL AFTER id');
    echo "Added uuid column\n";
} else {
    echo "uuid column already exists\n";
}

// 2. fill existing rows
$conn->executeStatement('UPDATE claro_mindme_markdown SET uuid = UUID() WHERE uuid IS NULL');
echo "Filled uuid for NULL rows\n";

// 3. make NOT NULL + unique index (idempotent)
$idx = $conn->fetchOne(
    "SELECT COUNT(*) FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'claro_mindme_markdown' AND INDEX_NAME = 'UNIQ_MD_UUID'"
);
$conn->executeStatement('ALTER TABLE claro_mindme_markdown MODIFY uuid VARCHAR(36) NOT NULL');
if (!$idx) {
    $conn->executeStatement('ALTER TABLE claro_mindme_markdown ADD UNIQUE INDEX UNIQ_MD_UUID (uuid)');
    echo "Added UNIQUE index\n";
} else {
    echo "UNIQUE index already exists\n";
}

// 4. verify
$rows = $conn->fetchAllAssociative('SELECT id, uuid FROM claro_mindme_markdown');
echo "Rows with uuid: ".count($rows)."\n";
foreach ($rows as $r) {
    echo "  #{$r['id']} uuid={$r['uuid']}\n";
}
$nulls = $conn->fetchOne('SELECT COUNT(*) FROM claro_mindme_markdown WHERE uuid IS NULL');
echo "NULL uuids: {$nulls}\n";

$kernel->shutdown();