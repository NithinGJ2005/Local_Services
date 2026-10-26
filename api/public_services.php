<?php
/**
 * Aguntaka Pahachana Kendra - Customer App Public Services API
 * Read-only, Returns ONLY Published Listings with Customer-Safe Fields
 * Pure PHP (Zero Node.js)
 */

if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';

$pdo = Database::getConnection();

// Parameters
$category = trim($_GET['category'] ?? '');
$city = trim($_GET['city'] ?? '');
$district = trim($_GET['district'] ?? '');
$search = trim($_GET['search'] ?? '');
$page = max(1, (int)($_GET['page'] ?? 1));
$limit = max(1, min(100, (int)($_GET['limit'] ?? 20)));
$offset = ($page - 1) * $limit;

// STRICT REQUIREMENT: Only Published services visible to customer app
$whereClauses = ["status = 'Published'"];
$params = [];

if (!empty($category) && in_array($category, SERVICE_CATEGORIES)) {
    $whereClauses[] = "category = ?";
    $params[] = $category;
}

if (!empty($city)) {
    $whereClauses[] = "city = ?";
    $params[] = $city;
}

if (!empty($district)) {
    $whereClauses[] = "district = ?";
    $params[] = $district;
}

if (!empty($search)) {
    $whereClauses[] = "(service_name LIKE ? OR locality LIKE ? OR address_line LIKE ?)";
    $q = "%{$search}%";
    $params[] = $q;
    $params[] = $q;
    $params[] = $q;
}

$whereSql = implode(' AND ', $whereClauses);

// Count
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM local_services WHERE {$whereSql}");
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

// Fetch strictly customer-safe fields
$sql = "
    SELECT 
        id, service_name, category, short_description, description, file_url, file_name, file_type, file_url AS image_url,
        phone, alternate_phone, email, website,
        address_line, locality, city, district, state, pincode,
        latitude, longitude, opening_time, closing_time, working_days,
        is_24_hours, facilities, accessibility_notes, public_notes
    FROM local_services
    WHERE {$whereSql}
    ORDER BY service_name ASC
    LIMIT {$limit} OFFSET {$offset}
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$services = $stmt->fetchAll();

echo json_encode([
    'success' => true,
    'count' => count($services),
    'total' => $total,
    'page' => $page,
    'limit' => $limit,
    'data' => $services
]);
