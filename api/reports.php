<?php
/**
 * Aguntaka Pahachana Kendra - Reports & Export Handler
 * Pure PHP (Zero Node.js)
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../config/constants.php';

Auth::requireAuth();
$pdo = Database::getConnection();

$export = $_GET['export'] ?? '';

// --------------------------------------------------------------------------
// 1. CSV Export Handler
// --------------------------------------------------------------------------
if ($export === 'csv') {
    $type = $_GET['type'] ?? 'all';
    $filename = "aguntaka_services_report_" . date('Y-m-d_His') . ".csv";

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');

    $output = fopen('php://output', 'w');
    // UTF-8 BOM for Excel compatibility
    fputs($output, "\xEF\xBB\xBF");

    // CSV Header row
    fputcsv($output, [
        'ID',
        'Service Name',
        'Category',
        'Status',
        'Phone',
        'Address',
        'Locality',
        'City',
        'District',
        'PIN Code',
        'Latitude',
        'Longitude',
        '24 Hours',
        'Working Hours',
        'Created At',
        'Last Updated'
    ]);

    $sql = "SELECT * FROM local_services";
    if ($type === 'missing_coords') {
        $sql .= " WHERE latitude IS NULL OR longitude IS NULL";
    } elseif ($type === 'missing_phone') {
        $sql .= " WHERE phone IS NULL OR phone = ''";
    } elseif ($type === 'draft') {
        $sql .= " WHERE status = 'Draft'";
    } elseif ($type === 'published') {
        $sql .= " WHERE status = 'Published'";
    }
    $sql .= " ORDER BY id ASC";

    $stmt = $pdo->query($sql);
    while ($row = $stmt->fetch()) {
        $hours = ($row['is_24_hours'] == 1) ? '24 Hours' : ($row['opening_time'] . ' - ' . $row['closing_time'] . ' (' . ($row['working_days'] ?? '') . ')');
        fputcsv($output, [
            $row['id'],
            $row['service_name'],
            $row['category'],
            $row['status'],
            $row['phone'],
            $row['address_line'],
            $row['locality'],
            $row['city'],
            $row['district'],
            $row['pincode'],
            $row['latitude'] ?? 'Not Set',
            $row['longitude'] ?? 'Not Set',
            $row['is_24_hours'] ? 'Yes' : 'No',
            $hours,
            $row['created_at'],
            $row['updated_at']
        ]);
    }

    fclose($output);
    exit;
}

// --------------------------------------------------------------------------
// 2. JSON Analytics Payload
// --------------------------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');

try {
    // Total services count
    $totalServices = (int)$pdo->query("SELECT COUNT(*) FROM local_services")->fetchColumn();

    // Counts by status
    $statusCounts = [
        'Published' => 0,
        'Draft' => 0,
        'Inactive' => 0,
        'Archived' => 0
    ];
    $statusRows = $pdo->query("SELECT status, COUNT(*) as cnt FROM local_services GROUP BY status")->fetchAll();
    foreach ($statusRows as $r) {
        $statusCounts[$r['status']] = (int)$r['cnt'];
    }

    // Services by category
    $categoryData = [];
    $catRows = $pdo->query("SELECT category, COUNT(*) as cnt FROM local_services GROUP BY category ORDER BY cnt DESC")->fetchAll();
    foreach ($catRows as $r) {
        $categoryData[$r['category']] = (int)$r['cnt'];
    }

    // Top districts
    $districtRows = $pdo->query("SELECT district, COUNT(*) as cnt FROM local_services GROUP BY district ORDER BY cnt DESC LIMIT 10")->fetchAll();

    // Data quality audits
    $missingCoords = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE latitude IS NULL OR longitude IS NULL")->fetchColumn();
    $missingPhone = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE phone IS NULL OR TRIM(phone) = ''")->fetchColumn();
    $staleCount = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE updated_at < DATE_SUB(NOW(), INTERVAL 90 DAY)")->fetchColumn();

    echo json_encode([
        'success' => true,
        'timestamp' => date('c'),
        'total' => $totalServices,
        'status_breakdown' => $statusCounts,
        'categories' => $categoryData,
        'districts' => $districtRows,
        'audits' => [
            'missing_coordinates' => $missingCoords,
            'missing_phone' => $missingPhone,
            'stale_listings' => $staleCount
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
