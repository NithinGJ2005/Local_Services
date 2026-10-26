<?php
/**
 * Aguntaka Pahachana Kendra - Local Services Staff API
 * Pure PHP Backend (Zero Node.js)
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../config/constants.php';

// Authentication required for staff API
if (!Auth::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Staff session required.']);
    exit;
}

$currentUser = Auth::user();
$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Handle method overrides for PUT / PATCH / DELETE in standard PHP forms
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}

// --------------------------------------------------------------------------
// 1. GET: Fetch list or single service
// --------------------------------------------------------------------------
if ($method === 'GET') {
    // Single service fetch
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare("
            SELECT s.*, 
                   cu.name AS creator_name, cu.email AS creator_email,
                   uu.name AS updater_name, uu.email AS updater_email
            FROM local_services s
            LEFT JOIN staff_users cu ON s.created_by = cu.id
            LEFT JOIN staff_users uu ON s.updated_by = uu.id
            WHERE s.id = ?
            LIMIT 1
        ");
        $stmt->execute([$id]);
        $service = $stmt->fetch();

        if (!$service) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Service listing not found.']);
            exit;
        }

        $service['logs'] = [];

        echo json_encode(['success' => true, 'data' => $service]);
        exit;
    }

    // List & Filter services
    $search = trim($_GET['search'] ?? '');
    $category = trim($_GET['category'] ?? '');
    $status = trim($_GET['status'] ?? '');
    $district = trim($_GET['district'] ?? '');
    $city = trim($_GET['city'] ?? '');
    $hasCoords = trim($_GET['has_coords'] ?? '');
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = max(1, min(1000, (int)($_GET['limit'] ?? 500)));
    $offset = ($page - 1) * $limit;

    $whereClauses = ["1=1"];
    $params = [];

    if (!empty($search)) {
        $whereClauses[] = "(s.service_name LIKE ? OR s.locality LIKE ? OR s.phone LIKE ? OR s.address_line LIKE ?)";
        $wildcard = "%{$search}%";
        $params[] = $wildcard;
        $params[] = $wildcard;
        $params[] = $wildcard;
        $params[] = $wildcard;
    }

    if (!empty($category)) {
        $whereClauses[] = "s.category = ?";
        $params[] = $category;
    }

    if (!empty($status)) {
        $whereClauses[] = "s.status = ?";
        $params[] = $status;
    }

    if (!empty($district)) {
        $whereClauses[] = "s.district = ?";
        $params[] = $district;
    }

    if (!empty($city)) {
        $whereClauses[] = "s.city = ?";
        $params[] = $city;
    }

    if ($hasCoords === '1') {
        $whereClauses[] = "s.latitude IS NOT NULL AND s.longitude IS NOT NULL";
    } elseif ($hasCoords === '0') {
        $whereClauses[] = "(s.latitude IS NULL OR s.longitude IS NULL)";
    }

    $whereSql = implode(' AND ', $whereClauses);

    // Count total matches
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM local_services s WHERE {$whereSql}");
    $countStmt->execute($params);
    $totalRecords = (int)$countStmt->fetchColumn();

    // Fetch page items
    $selectSql = "
        SELECT s.id, s.service_name, s.category, s.locality, s.city, s.district, s.state, 
               s.phone, s.status, s.latitude, s.longitude, s.is_24_hours, s.updated_at,
               u.name AS creator_name
        FROM local_services s
        LEFT JOIN staff_users u ON s.created_by = u.id
        WHERE {$whereSql}
        ORDER BY s.updated_at DESC
        LIMIT {$limit} OFFSET {$offset}
    ";
    $listStmt = $pdo->prepare($selectSql);
    $listStmt->execute($params);
    $rows = $listStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $rows,
        'pagination' => [
            'total' => $totalRecords,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($totalRecords / $limit)
        ]
    ]);
    exit;
}

// Read raw JSON body if Content-Type is application/json
$rawInput = file_get_contents('php://input');
$jsonBody = json_decode($rawInput, true);
$input = is_array($jsonBody) ? array_merge($_POST, $jsonBody) : $_POST;

// --------------------------------------------------------------------------
// 2. POST: Create New Service Listing
// --------------------------------------------------------------------------
if ($method === 'POST') {
    $serviceName = trim($input['service_name'] ?? '');
    $category = trim($input['category'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $addressLine = trim($input['address_line'] ?? '');
    $locality = trim($input['locality'] ?? '');
    $city = trim($input['city'] ?? '');
    $district = trim($input['district'] ?? '');
    $state = trim($input['state'] ?? 'Karnataka');
    $pincode = trim($input['pincode'] ?? '');
    $status = trim($input['status'] ?? 'Draft');

    // Validation
    $errors = [];
    if (empty($serviceName)) $errors[] = 'Service Name is required.';
    if (empty($category)) $errors[] = 'Valid Category selection is required.';
    if (empty($phone)) $errors[] = 'Public contact number is required.';
    if (empty($addressLine)) $errors[] = 'Address Line is required.';
    if (empty($locality)) $errors[] = 'Locality / Area is required.';
    if (empty($city)) $errors[] = 'City / Town is required.';
    if (empty($district)) $errors[] = 'District is required.';

    // Coordinates validation
    $lat = !empty($input['latitude']) ? (float)$input['latitude'] : null;
    $lng = !empty($input['longitude']) ? (float)$input['longitude'] : null;

    if ($lat !== null && ($lat < 6.0 || $lat > 37.5)) {
        $errors[] = 'Latitude must be within India (between 6.0° and 37.5° North).';
    }
    if ($lng !== null && ($lng < 68.0 || $lng > 97.5)) {
        $errors[] = 'Longitude must be within India (between 68.0° and 97.5° East).';
    }

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => implode(' ', $errors), 'errors' => $errors]);
        exit;
    }

    $publishedAt = ($status === 'Published') ? date('Y-m-d H:i:s') : null;

    $fileUrl = trim($input['file_url'] ?? $input['image_url'] ?? '');
    $fileName = trim($input['file_name'] ?? '');
    $fileType = trim($input['file_type'] ?? '');
    if (!empty($fileUrl) && empty($fileName)) {
        $fileName = basename($fileUrl);
    }

    $stmt = $pdo->prepare("
        INSERT INTO local_services (
            service_name, category, short_description, description, file_url, file_name, file_type,
            phone, alternate_phone, email, website, contact_person,
            address_line, locality, city, district, state, pincode,
            latitude, longitude, opening_time, closing_time, working_days,
            is_24_hours, availability_notes, facilities, accessibility_notes,
            public_notes, internal_notes, status, created_by, updated_by, published_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?
        )
    ");

    $is24 = !empty($input['is_24_hours']) ? 1 : 0;
    $openTime = !empty($input['opening_time']) ? $input['opening_time'] : null;
    $closeTime = !empty($input['closing_time']) ? $input['closing_time'] : null;

    $success = $stmt->execute([
        $serviceName,
        $category,
        trim($input['short_description'] ?? ''),
        trim($input['description'] ?? ''),
        $fileUrl,
        $fileName,
        $fileType,
        $phone,
        trim($input['alternate_phone'] ?? ''),
        trim($input['email'] ?? ''),
        trim($input['website'] ?? ''),
        trim($input['contact_person'] ?? ''),
        $addressLine,
        $locality,
        $city,
        $district,
        $state,
        $pincode,
        $lat,
        $lng,
        $openTime,
        $closeTime,
        trim($input['working_days'] ?? ''),
        $is24,
        trim($input['availability_notes'] ?? ''),
        trim($input['facilities'] ?? ''),
        trim($input['accessibility_notes'] ?? ''),
        trim($input['public_notes'] ?? ''),
        trim($input['internal_notes'] ?? ''),
        $status,
        $currentUser['id'],
        $currentUser['id'],
        $publishedAt
    ]);

    $newId = (int)$pdo->lastInsertId();
    logServiceActivity($newId, $currentUser['id'], 'create', "Created service listing with status '{$status}'.");

    echo json_encode([
        'success' => true,
        'message' => 'Service listing created successfully.',
        'id' => $newId,
        'status' => $status
    ]);
    exit;
}

// --------------------------------------------------------------------------
// 3. PUT: Update Existing Service Listing
// --------------------------------------------------------------------------
if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? ($input['id'] ?? 0));
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing service ID.']);
        exit;
    }

    $serviceName = trim($input['service_name'] ?? '');
    $category = trim($input['category'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $addressLine = trim($input['address_line'] ?? '');
    $locality = trim($input['locality'] ?? '');
    $city = trim($input['city'] ?? '');
    $district = trim($input['district'] ?? '');
    $state = trim($input['state'] ?? 'Karnataka');
    $pincode = trim($input['pincode'] ?? '');
    $status = trim($input['status'] ?? '');

    $errors = [];
    if (empty($serviceName)) $errors[] = 'Service Name is required.';
    if (empty($category)) $errors[] = 'Valid Category is required.';
    if (empty($phone)) $errors[] = 'Contact phone is required.';
    if (empty($addressLine)) $errors[] = 'Address Line is required.';
    if (empty($locality)) $errors[] = 'Locality is required.';
    if (empty($city)) $errors[] = 'City is required.';
    if (empty($district)) $errors[] = 'District is required.';

    $lat = !empty($input['latitude']) ? (float)$input['latitude'] : null;
    $lng = !empty($input['longitude']) ? (float)$input['longitude'] : null;

    if ($lat !== null && ($lat < 6.0 || $lat > 37.5)) $errors[] = 'Latitude must be within India (between 6.0° and 37.5° North).';
    if ($lng !== null && ($lng < 68.0 || $lng > 97.5)) $errors[] = 'Longitude must be within India (between 68.0° and 97.5° East).';

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        exit;
    }

    $is24 = !empty($input['is_24_hours']) ? 1 : 0;
    $openTime = !empty($input['opening_time']) ? $input['opening_time'] : null;
    $closeTime = !empty($input['closing_time']) ? $input['closing_time'] : null;

    $fileUrl = trim($input['file_url'] ?? $input['image_url'] ?? '');
    $fileName = trim($input['file_name'] ?? '');
    $fileType = trim($input['file_type'] ?? '');
    if (!empty($fileUrl) && empty($fileName)) {
        $fileName = basename($fileUrl);
    }

    $sql = "
        UPDATE local_services SET
            service_name = ?, category = ?, short_description = ?, description = ?, 
            file_url = ?, file_name = ?, file_type = ?,
            phone = ?, alternate_phone = ?, email = ?, website = ?, contact_person = ?,
            address_line = ?, locality = ?, city = ?, district = ?, state = ?, pincode = ?,
            latitude = ?, longitude = ?, opening_time = ?, closing_time = ?, working_days = ?,
            is_24_hours = ?, availability_notes = ?, facilities = ?, accessibility_notes = ?,
            public_notes = ?, internal_notes = ?, updated_by = ?, updated_at = NOW()
    ";
    $params = [
        $serviceName, $category, trim($input['short_description'] ?? ''), trim($input['description'] ?? ''), 
        $fileUrl, $fileName, $fileType,
        $phone, trim($input['alternate_phone'] ?? ''), trim($input['email'] ?? ''), trim($input['website'] ?? ''), trim($input['contact_person'] ?? ''),
        $addressLine, $locality, $city, $district, $state, $pincode,
        $lat, $lng, $openTime, $closeTime, trim($input['working_days'] ?? ''),
        $is24, trim($input['availability_notes'] ?? ''), trim($input['facilities'] ?? ''), trim($input['accessibility_notes'] ?? ''),
        trim($input['public_notes'] ?? ''), trim($input['internal_notes'] ?? ''), $currentUser['id']
    ];

    if (!empty($status)) {
        $sql .= ", status = ?";
        $params[] = $status;
        if ($status === 'Published') {
            $sql .= ", published_at = IFNULL(published_at, NOW())";
        }
    }

    $sql .= " WHERE id = ?";
    $params[] = $id;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    logServiceActivity($id, $currentUser['id'], 'edit', "Updated service information.");

    echo json_encode(['success' => true, 'message' => 'Service listing updated successfully.']);
    exit;
}

// --------------------------------------------------------------------------
// 4. PATCH: Direct Status Update (Publish / Draft toggle by Staff - No supervisor review needed)
// --------------------------------------------------------------------------
if ($method === 'PATCH') {
    $id = (int)($_GET['id'] ?? ($input['id'] ?? 0));
    $newStatus = trim($input['status'] ?? '');
    $actionType = trim($input['action'] ?? '');

    if (!$id || empty($newStatus)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing service ID or new status.']);
        exit;
    }

    if (!in_array($newStatus, SERVICE_STATUSES)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'Invalid status supplied. Only Draft and Published are permitted.']);
        exit;
    }

    $publishedAtSql = "";
    if ($newStatus === 'Published') {
        $publishedAtSql = ", published_at = NOW()";
    }

    $stmt = $pdo->prepare("
        UPDATE local_services 
        SET status = ?, updated_by = ?, updated_at = NOW() {$publishedAtSql}
        WHERE id = ?
    ");
    $stmt->execute([$newStatus, $currentUser['id'], $id]);

    $logAction = !empty($actionType) ? $actionType : strtolower($newStatus);
    logServiceActivity($id, $currentUser['id'], $logAction, "Status changed to '{$newStatus}'.");

    echo json_encode([
        'success' => true, 
        'message' => "Service status updated to {$newStatus}.",
        'status' => $newStatus
    ]);
    exit;
}

// --------------------------------------------------------------------------
// 5. DELETE: Delete local service listing
// --------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? ($input['id'] ?? 0));
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing service ID.']);
        exit;
    }

    // Verify service exists
    $checkStmt = $pdo->prepare("SELECT id, service_name FROM local_services WHERE id = ?");
    $checkStmt->execute([$id]);
    $svc = $checkStmt->fetch();

    if (!$svc) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Service listing not found.']);
        exit;
    }

    // Delete listing (associated activity logs cascade automatically)
    $stmt = $pdo->prepare("DELETE FROM local_services WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        'success' => true,
        'message' => "Service '{$svc['service_name']}' was successfully deleted.",
        'deleted_id' => $id
    ]);
    exit;
}

// Default fallback
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
