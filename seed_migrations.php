<?php
/**
 * Seed migration tracking tables for already-existing tables.
 * Run inside container: podman exec -w /var/www/html lamp-php83 php seed_migrations.php
 */

$dbHost = 'database';
$dbName = 'claroline';
$dbUser = 'root';
$dbPass = 'docker';

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage() . "\n");
}

// Get existing tables
$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
echo "Found " . count($tables) . " existing tables\n\n";

$srcDir = __DIR__ . '/src';
$totalMarked = 0;

// Scan all bundles
foreach (glob($srcDir . '/*/*/Installation/Migrations', GLOB_ONLYDIR) as $migrationsDir) {
    // Determine bundle name from path: src/main/core/Installation/Migrations -> core
    $parts = explode('/', $migrationsDir);
    $bundleName = $parts[count($parts) - 3]; // e.g., "core", "authentication"
    $trackingTable = 'doctrine_' . strtolower($bundleName) . '_versions';

    echo "Bundle: $bundleName\n";

    // Create tracking table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `$trackingTable` (
        version VARCHAR(191) NOT NULL,
        executed_at DATETIME DEFAULT NULL,
        execution_time INT DEFAULT NULL,
        PRIMARY KEY(version)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    foreach (glob($migrationsDir . '/Version*.php') as $file) {
        $version = basename($file, '.php');
        $content = file_get_contents($file);

        preg_match_all("/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?/i", $content, $matches);
        $migrationTables = $matches[1] ?? [];

        if (empty($migrationTables)) {
            continue;
        }

        // Check if all target tables exist
        $allExist = true;
        foreach ($migrationTables as $t) {
            if (!in_array($t, $tables)) {
                $allExist = false;
                break;
            }
        }

        if ($allExist) {
            // Insert tracking record
            try {
                $stmt = $pdo->prepare("INSERT IGNORE INTO `$trackingTable` (version, executed_at, execution_time) VALUES (?, NOW(), 0)");
                $stmt->execute([$version]);
                if ($stmt->rowCount() > 0) {
                    echo "  ✓ $version (" . implode(', ', $migrationTables) . ")\n";
                    $totalMarked++;
                }
            } catch (PDOException $e) {
                echo "  ✗ $version ERROR: " . $e->getMessage() . "\n";
            }
        } else {
            $missing = array_diff($migrationTables, $tables);
            echo "  - $version PENDING (missing: " . implode(', ', $missing) . ")\n";
        }
    }
    echo "\n";
}

echo "Total marked: $totalMarked migrations\n";
