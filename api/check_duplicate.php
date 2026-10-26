<?php
/**
 * Aguntaka Pahachana Kendra - Duplicate Warning Detection API
 * Checks for existing listings with matching or similar name and address
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

if (!Auth::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$pdo = Database::getConnection();

$name = trim($_GET['name'] ?? '');
$address = trim($_GET['address'] ?? '');
$excludeId = (int)($_GET['exclude_id'] ?? 0);

if (strlen($name) < 3) {
    echo json_encode(['success' => true, 'duplicate' => false, 'matches' => []]);
    exit;
}

$sql = "
    SELECT id, service_name, category, address_line, locality, city, status
    FROM local_services
    WHERE id != ? 
      AND (
          service_name LIKE ? 
          OR (address_line LIKE ? AND address_line != '')
      )
    LIMIT 3
";

$stmt = $pdo->prepare($sql);
$nameLike = "%{$name}%";
$addrLike = !empty($address) ? "%{$address}%" : "%__NO_ADDR__%";
$stmt->execute([$excludeId, $nameLike, $addrLike]);
$matches = $stmt->fetchAll();

echo json_encode([
    'success' => true,
    'duplicate' => count($matches) > 0,
    'count' => count($matches),
    'matches' => $matches
]);
