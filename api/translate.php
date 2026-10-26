<?php
/**
 * Aguntaka Pahachana Kendra - High-Speed Bi-directional English <-> Kannada Translation API
 * Features parallel multi-cURL execution and caching for ultra-fast translations
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/auth.php';

if (!Auth::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
session_write_close();

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$requestedSource = trim($data['source'] ?? 'auto');
$requestedTarget = trim($data['target'] ?? '');
$singleText = isset($data['text']) ? trim($data['text']) : null;
$fields = isset($data['fields']) && is_array($data['fields']) ? $data['fields'] : null;

if ($singleText === null && empty($fields)) {
    echo json_encode(['success' => false, 'message' => 'No text or fields provided for translation']);
    exit;
}

/**
 * Detect if text contains Kannada characters
 */
function isKannada(string $text): bool {
    return (bool)preg_match('/[\x{0C80}-\x{0CFF}]/u', $text);
}

/**
 * Simple file-based translation cache for instant response
 */
function getCachedTranslation(string $text, string $pair): ?string {
    $cacheDir = __DIR__ . '/../cache/translations';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0777, true);
    }
    $key = md5("{$pair}_{$text}");
    $file = "{$cacheDir}/{$key}.txt";
    if (file_exists($file)) {
        $content = @file_get_contents($file);
        if ($content !== false && $content !== '') {
            return $content;
        }
    }
    return null;
}

function setCachedTranslation(string $text, string $pair, string $translated): void {
    $cacheDir = __DIR__ . '/../cache/translations';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0777, true);
    }
    $key = md5("{$pair}_{$text}");
    $file = "{$cacheDir}/{$key}.txt";
    @file_put_contents($file, $translated);
}

/**
 * Clean and decode translated text
 */
function cleanTranslatedText(string $raw): string {
    $decoded = html_entity_decode($raw, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    if (str_starts_with($decoded, 'MYMEMORY WARNING:')) {
        return '';
    }
    return trim($decoded);
}

/**
 * Parallel batch translation using curl_multi
 */
function translateFieldsParallel(array $fields, string $source, string $target): array {
    $results = [];
    $toFetch = [];
    $pair = "{$source}|{$target}";

    // Check cache first
    foreach ($fields as $key => $val) {
        $str = trim((string)$val);
        if ($str === '') {
            $results[$key] = '';
            continue;
        }

        $cached = getCachedTranslation($str, $pair);
        if ($cached !== null) {
            $results[$key] = $cached;
        } else {
            $toFetch[$key] = $str;
        }
    }

    if (empty($toFetch)) {
        return $results;
    }

    // Initialize multi-cURL for remaining fields
    $mh = curl_multi_init();
    $curlHandles = [];

    foreach ($toFetch as $key => $str) {
        $url = "https://api.mymemory.translated.net/get?q=" . urlencode($str) . "&langpair=" . urlencode($pair);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 4);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
        curl_multi_add_handle($mh, $ch);
        $curlHandles[$key] = $ch;
    }

    // Execute multi handles concurrently
    $running = null;
    do {
        $status = curl_multi_exec($mh, $running);
        if ($running) {
            curl_multi_select($mh, 0.05);
        }
    } while ($running > 0 && $status === CURLM_OK);

    // Extract results
    foreach ($curlHandles as $key => $ch) {
        $response = curl_multi_getcontent($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);

        $translated = '';
        if ($httpCode === 200 && $response) {
            $resData = json_decode($response, true);
            if (!empty($resData['responseData']['translatedText'])) {
                $translated = cleanTranslatedText($resData['responseData']['translatedText']);
            }
        }

        // If primary failed or empty, fallback to original or quick mobile endpoint
        if ($translated === '') {
            $translated = fallbackTranslate($toFetch[$key], $source, $target);
        }

        if ($translated !== '') {
            setCachedTranslation($toFetch[$key], $pair, $translated);
            $results[$key] = $translated;
        } else {
            $results[$key] = $toFetch[$key];
        }
    }

    curl_multi_close($mh);
    return $results;
}

/**
 * Fallback translation using Google mobile endpoint
 */
function fallbackTranslate(string $text, string $source, string $target): string {
    $fallbackUrl = "https://translate.google.com/m?sl=" . urlencode($source) . "&tl=" . urlencode($target) . "&q=" . urlencode($text);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $fallbackUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 4);
    $res = curl_exec($ch);
    curl_close($ch);

    if ($res && preg_match('/<div[^>]*class="result-container"[^>]*>(.*?)<\/div>/is', $res, $matches)) {
        return html_entity_decode(strip_tags($matches[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
    return $text;
}

// Processing Single Text
if ($singleText !== null) {
    $src = $requestedSource;
    $tgt = $requestedTarget;
    if ($src === 'auto' || empty($src)) {
        $src = isKannada($singleText) ? 'kn' : 'en';
        $tgt = ($src === 'kn') ? 'en' : 'kn';
    } elseif (empty($tgt)) {
        $tgt = ($src === 'kn') ? 'en' : 'kn';
    }

    $res = translateFieldsParallel(['text' => $singleText], $src, $tgt);
    echo json_encode([
        'success' => true,
        'source' => $src,
        'target' => $tgt,
        'translatedText' => $res['text'] ?? $singleText
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Processing Batch Fields
if ($fields !== null) {
    // Detect dominant language of the filled fields
    $kannadaCount = 0;
    $englishCount = 0;
    foreach ($fields as $key => $val) {
        $t = trim((string)$val);
        if ($t === '') continue;
        if (isKannada($t)) {
            $kannadaCount++;
        } else {
            $englishCount++;
        }
    }

    $detectedSource = ($kannadaCount > $englishCount) ? 'kn' : 'en';
    $source = ($requestedSource !== 'auto' && !empty($requestedSource)) ? $requestedSource : $detectedSource;
    $target = !empty($requestedTarget) ? $requestedTarget : (($source === 'kn') ? 'en' : 'kn');

    $translatedFields = translateFieldsParallel($fields, $source, $target);

    echo json_encode([
        'success' => true,
        'source' => $source,
        'target' => $target,
        'translations' => $translatedFields,
        'translatedCount' => count(array_filter($translatedFields, fn($v) => $v !== ''))
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
