<?php
/**
 * Aguntaka Pahachana Kendra - Nearby Services API
 * Geospatial distance calculation using Haversine formula
 * Returns ONLY Published listings around requested coordinates
 */

if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';

$lat = isset($_GET['lat']) ? filter_var($_GET['lat'], FILTER_VALIDATE_FLOAT) : null;
$lng = isset($_GET['lng']) ? filter_var($_GET['lng'], FILTER_VALIDATE_FLOAT) : null;
$radiusKm = isset($_GET['radius']) ? max(1, min(100, (float)$_GET['radius'])) : 10.0; // Default 10km radius
$category = trim($_GET['category'] ?? '');
$limit = max(1, min(50, (int)($_GET['limit'] ?? 20)));

if ($lat === null || $lng === null || $lat < -90 || $lat > 90 || $lng < -180 || $lng > 180) {
    if (!headers_sent()) http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Valid latitude (-90 to 90) and longitude (-180 to 180) are required for nearby lookup.'
    ]);
    exit;
}

$pdo = Database::getConnection();

// Haversine formula for distance calculation in kilometers
// Earth radius ~ 6371 km
// Lat/Lng are validated floats, safe for sprintf formatting
$sql = sprintf(
    "SELECT 
        id, service_name, category, short_description, description, file_url, file_name, file_type, file_url AS image_url,
        phone, alternate_phone, email, website,
        address_line, locality, city, district, state, pincode,
        latitude, longitude, opening_time, closing_time, working_days,
        is_24_hours, facilities, accessibility_notes, public_notes,
        ROUND((6371 * acos(
            LEAST(1.0, GREATEST(-1.0, 
                cos(radians(%F)) * cos(radians(latitude)) * 
                cos(radians(longitude) - radians(%F)) + 
                sin(radians(%F)) * sin(radians(latitude))
            ))
        )), 2) AS distance_km
    FROM local_services
    WHERE status = 'Published'
      AND latitude IS NOT NULL 
      AND longitude IS NOT NULL",
    $lat, $lng, $lat
);

$params = [];
if (!empty($category) && in_array($category, SERVICE_CATEGORIES)) {
    $sql .= " AND category = ?";
    $params[] = $category;
}

$sql .= sprintf(" HAVING distance_km <= %F ORDER BY distance_km ASC LIMIT %d", $radiusKm, $limit);

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$results = $stmt->fetchAll();

echo json_encode([
    'success' => true,
    'user_location' => [
        'latitude' => $lat,
        'longitude' => $lng
    ],
    'radius_km' => $radiusKm,
    'count' => count($results),
    'data' => $results
]);
