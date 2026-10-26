<?php
/**
 * Aguntaka Pahachana Kendra - Local Services Staff Dashboard
 * Database Configuration & Connection Handler
 * Pure PHP PDO for XAMPP (Zero Node.js)
 */

if (!defined('APP_INIT')) {
    define('APP_INIT', true);
}

// Database Credentials (Standard XAMPP default: host: localhost, user: root, password: "")
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'aguntaka_local_services');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_CHARSET', 'utf8mb4');

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // If database doesn't exist yet, attempt automatic creation
                if ($e->getCode() == 1049 || str_contains($e->getMessage(), 'Unknown database')) {
                    self::initializeDatabase();
                    self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                } else {
                    die(json_encode([
                        'success' => false,
                        'message' => 'Database connection failed: ' . $e->getMessage() . '. Please verify XAMPP MySQL is running.'
                    ]));
                }
            }
        }
        return self::$instance;
    }

    /**
     * Automatic Database and Tables initialisation from schema.sql
     */
    public static function initializeDatabase(): bool
    {
        try {
            $rootDsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
            $rootPdo = new PDO($rootDsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);

            $sqlFile = __DIR__ . '/../database/schema.sql';
            if (file_exists($sqlFile)) {
                $sql = file_get_contents($sqlFile);
                $rootPdo->exec($sql);
                return true;
            }
            return false;
        } catch (PDOException $ex) {
            error_log("Database initialization error: " . $ex->getMessage());
            return false;
        }
    }
}

/**
 * Log activity helper (No-op: service_activity_logs table removed)
 */
function logServiceActivity(int $serviceId, ?int $staffId, string $action, string $details = ''): bool
{
    return true;
}
