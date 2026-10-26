<?php
/**
 * Aguntaka Pahachana Kendra - Reverse Geocoding API
 * Resolves latitude and longitude coordinates into State, District, City/Town, Postal Code, and Area.
 * Pure PHP Backend (Zero Node.js)
 */

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

// Public coordinate helper endpoint (coordinates are non-sensitive geographical data)

$lat = isset($_GET['lat']) ? filter_var($_GET['lat'], FILTER_VALIDATE_FLOAT) : false;
$lng = isset($_GET['lng']) ? filter_var($_GET['lng'], FILTER_VALIDATE_FLOAT) : false;

if ($lat === false || $lng === false || $lat < 6.0 || $lat > 37.5 || $lng < 68.0 || $lng > 97.5) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Coordinates must be located within India (Latitude: 6.0° to 37.5° N, Longitude: 68.0° to 97.5° E).'
    ]);
    exit;
}

// Cache key using rounded coordinates (~11 meters resolution)
$cacheKey = sprintf('geocode_india_%.4f_%.4f', $lat, $lng);
$cacheDir = __DIR__ . '/../cache';
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0777, true);
}
$cacheFile = $cacheDir . '/' . md5($cacheKey) . '.json';

if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 86400 * 7)) {
    $cached = file_get_contents($cacheFile);
    if ($cached) {
        echo $cached;
        exit;
    }
}

// Fetch from OpenStreetMap Nominatim reverse API with country restriction to India (in)
$url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={$lat}&lon={$lng}&zoom=18&addressdetails=1&countrycodes=in";

$response = false;

// 1. Try via cURL
if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'AguntakaLocalServices/1.0 (StaffDashboard; contact@aguntaka.gov.in)');
    curl_setopt($ch, CURLOPT_TIMEOUT, 4);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    $response = curl_exec($ch);
    curl_close($ch);
}

// 2. Fallback to stream context
if (!$response) {
    $ctx = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => [
                "User-Agent: AguntakaLocalServices/1.0 (StaffDashboard; contact@aguntaka.gov.in)",
                "Accept: application/json"
            ],
            'timeout' => 4.0
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    $response = @file_get_contents($url, false, $ctx);
}

if ($response) {
    $json = json_decode($response, true);
    if ($json && !empty($json['address'])) {
        $addr = $json['address'];

        // Strict verification: Ensure resolved location belongs to India
        $countryCode = strtolower($addr['country_code'] ?? '');
        $countryName = strtolower($addr['country'] ?? '');
        if ($countryCode !== 'in' && $countryName !== 'india' && !empty($countryCode)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Selected location is outside India. Please select coordinates within India.',
                'data' => null
            ]);
            exit;
        }
        
        $state = $addr['state'] ?? '';
        $stateDistrict = $addr['state_district'] ?? '';
        $county = $addr['county'] ?? '';
        $city = $addr['city'] ?? $addr['town'] ?? $addr['village'] ?? $addr['municipality'] ?? $addr['suburb'] ?? $county ?? '';
        $district = $stateDistrict ?: ($county ?: '');
        $postcode = $addr['postcode'] ?? '';
        $locality = $addr['suburb'] ?? $addr['neighbourhood'] ?? $addr['quarter'] ?? $addr['village'] ?? $addr['hamlet'] ?? $addr['residential'] ?? '';
        $road = $addr['road'] ?? '';

        $result = [
            'success' => true,
            'data' => [
                'state' => $state,
                'district' => $district,
                'city' => $city,
                'county' => $county,
                'state_district' => $stateDistrict,
                'pincode' => $postcode,
                'locality' => $locality,
                'road' => $road,
                'display_name' => $json['display_name'] ?? '',
                'address' => $addr
            ]
        ];

        $encoded = json_encode($result);
        @file_put_contents($cacheFile, $encoded);
        echo $encoded;
        exit;
    }
}

// Fallback response if network is unavailable
echo json_encode([
    'success' => false,
    'message' => 'Reverse geocoding unavailable or no address details found for given coordinates.',
    'data' => null
]);
