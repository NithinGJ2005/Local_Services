<?php
/**
 * Aguntaka Pahachana Kendra - Layout Header
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../config/constants.php';

Auth::requireAuth();
$currentUser = Auth::user();

$currentPage = basename($_SERVER['PHP_SELF']);
$pageTitle = $pageTitle ?? 'Local Services Staff Dashboard';
$pageSubtitle = $pageSubtitle ?? 'Aguntaka Pahachana Kendra';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?= htmlspecialchars($pageTitle) ?> | Aguntaka Local Services</title>
    
    <!-- Design & Styling -->
    <link rel="stylesheet" href="assets/css/style.css?v=<?= file_exists(__DIR__ . '/../assets/css/style.css') ? filemtime(__DIR__ . '/../assets/css/style.css') : '1.0' ?>">
    
    <!-- Leaflet OpenStreetMap CDN (Zero API Key Required, Fast, Open Source) -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>

    <!-- Persist Sidebar Minimized State to prevent UI jump -->
    <script>
        if (localStorage.getItem('sidebar_minimized') === 'true') {
            document.documentElement.classList.add('sidebar-collapsed');
        }
    </script>
</head>
<body>
<div class="app-wrapper">
