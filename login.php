<?php
/**
 * Aguntaka Pahachana Kendra - Staff Login Screen
 * Pure PHP + Vanilla HTML/JS for XAMPP
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/auth.php';

// Redirect if already logged in
if (Auth::isLoggedIn()) {
    header('Location: dashboard.php');
    exit;
}

$errorMessage = '';
$identifier = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $identifier = trim($_POST['identifier'] ?? '');
    $password = $_POST['password'] ?? '';
    
    $result = Auth::attempt($identifier, $password);
    if ($result['success']) {
        $redirect = !empty($_GET['redirect']) ? urldecode($_GET['redirect']) : 'dashboard.php';
        header("Location: {$redirect}");
        exit;
    } else {
        $errorMessage = $result['message'];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Staff Login | Aguntaka Pahachana Kendra - Local Services</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body {
            background-color: #f1f5f9;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .login-card {
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 12px 30px -6px rgba(0, 0, 0, 0.08), 0 4px 10px -3px rgba(0, 0, 0, 0.03);
            max-width: 440px;
            width: 100%;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .login-header {
            background: #ffffff;
            padding: 30px 24px 20px;
            color: #0f172a;
            text-align: center;
            border-bottom: 1px solid #f1f5f9;
        }
        .login-logo-wrap {
            display: inline-block;
            margin-bottom: 12px;
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .login-logo-wrap:hover {
            transform: scale(1.06) rotate(-1deg);
        }
        .login-logo-img {
            height: 96px;
            width: auto;
            max-width: 100%;
            object-fit: contain;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.06));
            transition: filter 0.3s ease;
        }
        .login-logo-wrap:hover .login-logo-img {
            filter: drop-shadow(0 8px 16px rgba(37, 99, 235, 0.18));
        }
        .login-app-title {
            color: #0f172a;
            font-size: 19px;
            font-weight: 700;
            letter-spacing: -0.3px;
            margin: 0;
        }
        .login-app-subtitle {
            color: #64748b;
            font-size: 12px;
            margin-top: 4px;
            font-weight: 500;
        }
        .login-body {
            padding: 26px 26px 32px;
        }
        .demo-box {
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            padding: 14px;
            margin-top: 24px;
            font-size: 12px;
        }
        .demo-btn-group {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }
        .password-wrap {
            position: relative;
        }
        .password-toggle-btn {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            padding: 4px;
        }
        .password-toggle-btn:hover {
            color: #2563eb;
        }
    </style>
</head>
<body>

<div class="login-card">
    <div class="login-header">
        <div class="login-logo-wrap" title="Aguntaka Pahachana Kendra Official Portal">
            <img src="assets/img/logo.png" alt="Aguntaka Pahachana Kendra Logo" class="login-logo-img">
        </div>
        <h2 class="login-app-title">Aguntaka Pahachana Kendra</h2>
        <p class="login-app-subtitle">Local Services Staff Administration Portal</p>
    </div>

    <div class="login-body">
        <?php if (!empty($errorMessage)): ?>
            <div style="background:#fee2e2; border:1px solid #fecaca; color:#991b1b; padding:12px 14px; border-radius:8px; font-size:13px; margin-bottom:18px;">
                <strong>Notice:</strong> <?= htmlspecialchars($errorMessage) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php<?= !empty($_GET['redirect']) ? '?redirect=' . urlencode($_GET['redirect']) : '' ?>" id="loginForm">
            <div class="form-group" style="margin-bottom:18px;">
                <label class="form-label required" for="identifier">Username</label>
                <input type="text" name="identifier" id="identifier" class="form-control" 
                       placeholder="Enter username (e.g. staff)" 
                       value="<?= htmlspecialchars($identifier) ?>" required autocomplete="username" autofocus>
            </div>

            <div class="form-group" style="margin-bottom:24px;">
                <label class="form-label required" for="password">Password</label>
                <div class="password-wrap">
                    <input type="password" name="password" id="password" class="form-control" 
                           placeholder="Enter your password" required autocomplete="current-password">
                    <button type="button" class="password-toggle-btn" id="togglePassword">Show</button>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; font-size:14.5px; font-weight:600;">
                Log In
            </button>
        </form>
    </div>
</div>

<script>
    // Show / Hide password toggle
    const toggleBtn = document.getElementById('togglePassword');
    const pwdInput = document.getElementById('password');
    if (toggleBtn && pwdInput) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = pwdInput.type === 'password';
            pwdInput.type = isPassword ? 'text' : 'password';
            toggleBtn.textContent = isPassword ? 'Hide' : 'Show';
        });
    }
</script>

</body>
</html>
