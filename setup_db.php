<?php
/**
 * Aguntaka Pahachana Kendra - Database Setup & Verification Script
 * Pure PHP CLI / Browser runner for XAMPP
 */

require_once __DIR__ . '/config/database.php';

$isCli = (php_sapi_name() === 'cli');

if (!$isCli) {
    header('Content-Type: text/html; charset=utf-8');
}

echo $isCli ? "=== Aguntaka Local Services Database Setup ===\n" : "<h2>Aguntaka Local Services Database Setup</h2><pre>";

try {
    echo "Connecting to MySQL server at " . DB_HOST . "...\n";
    $success = Database::initializeDatabase();
    
    if ($success) {
        echo "✓ Schema executed successfully!\n";
        $pdo = Database::getConnection();
        
        $userCount = $pdo->query("SELECT COUNT(*) FROM staff_users")->fetchColumn();
        $serviceCount = $pdo->query("SELECT COUNT(*) FROM local_services")->fetchColumn();
        
        echo "✓ staff_users table verified: {$userCount} users found.\n";
        echo "✓ local_services table verified: {$serviceCount} listings found.\n";
        echo "\nSetup completed successfully! You can now use the dashboard.\n";
        if (!$isCli) {
            echo '<br><a href="login.php" style="padding:10px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;display:inline-block;margin-top:10px;">Go to Staff Login</a>';
        }
    } else {
        echo "✗ Failed to initialize database: schema.sql not found or error occurred.\n";
    }
} catch (Exception $e) {
    echo "✗ Setup Error: " . $e->getMessage() . "\n";
}

if (!$isCli) {
    echo "</pre>";
}
