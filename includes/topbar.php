<?php
/**
 * Aguntaka Pahachana Kendra - Top Navigation Bar
 */
?>
<main class="app-main">
    <header class="app-topbar">
        <div class="topbar-left">
            <button class="mobile-toggle-btn" id="mobileMenuToggle" aria-label="Toggle navigation">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            <div class="page-headline">
                <h1 class="page-title"><?= htmlspecialchars($pageTitle) ?></h1>
                <span class="page-subtitle"><?= htmlspecialchars($pageSubtitle) ?></span>
            </div>
        </div>

        <div class="topbar-right">
            <a href="logout.php" class="btn btn-secondary btn-sm" onclick="return confirm('Are you sure you want to log out of the staff dashboard?');">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log Out</span>
            </a>
        </div>
    </header>
    
    <div class="content-area">
