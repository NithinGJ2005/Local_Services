<?php
/**
 * Aguntaka Pahachana Kendra - Main Entry Router
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/auth.php';

if (Auth::isLoggedIn()) {
    header('Location: dashboard.php');
} else {
    header('Location: login.php');
}
exit;
