<?php
/**
 * Aguntaka Pahachana Kendra - File Upload API
 * Handles file uploads for service listings (images, logos, PDFs, documents)
 * Pure PHP Backend (Zero Node.js)
 */

header('Content-Type: application/json; charset=utf-8');

$uploadDir = __DIR__ . '/../uploads';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errorCode = $_FILES['file']['error'] ?? 'missing';
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => "No file uploaded or upload error code: {$errorCode}"]);
    exit;
}

$file = $_FILES['file'];
$maxSize = 25 * 1024 * 1024; // 25 MB

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File size exceeds maximum allowed limit (25MB).']);
    exit;
}

$origName = basename($file['name']);
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

// Allowed file extensions
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];

if (!in_array($ext, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid file type. Allowed formats: Photos (JPG, PNG, WebP, SVG, GIF) and Documents (PDF, Word, Excel, TXT).'
    ]);
    exit;
}

// Sanitize filename and create unique stored name
$safeBaseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($origName, PATHINFO_FILENAME));
$safeBaseName = substr($safeBaseName, 0, 40);
$uniqueName = time() . '_' . substr(bin2hex(random_bytes(4)), 0, 8) . '_' . $safeBaseName . '.' . $ext;
$targetPath = $uploadDir . '/' . $uniqueName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    $relativeUrl = 'uploads/' . $uniqueName;
    echo json_encode([
        'success' => true,
        'message' => 'File uploaded successfully.',
        'file_url' => $relativeUrl,
        'file_name' => $origName,
        'file_type' => $file['type'] ?? ('application/' . $ext),
        'file_size' => $file['size'],
        'is_image' => in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])
    ]);
    exit;
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save uploaded file to server.']);
    exit;
}
