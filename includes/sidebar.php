<?php
/**
 * Aguntaka Pahachana Kendra - Persistent Left Sidebar
 */
?>
<aside class="app-sidebar" id="appSidebar">
    <div class="sidebar-header">
        <a href="dashboard.php" class="sidebar-brand-link">
            <img src="assets/img/logo.png" alt="Aguntaka Kendra Logo" class="sidebar-logo-img">
            <div class="sidebar-title-wrap">
                <span class="sidebar-app-name">Aguntaka Kendra</span>
                <span class="sidebar-app-sub">Local Services Desk</span>
            </div>
        </a>
        <button type="button" class="sidebar-collapse-btn" id="sidebarCollapseBtn" aria-label="Minimize sidebar menu" title="Minimize sidebar menu">
            <svg class="collapse-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
    </div>

    <nav class="sidebar-nav">
        <a href="dashboard.php" class="nav-link <?= ($currentPage === 'dashboard.php') ? 'active' : '' ?>" title="Dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Dashboard</span>
        </a>

        <a href="services.php" class="nav-link <?= ($currentPage === 'services.php') ? 'active' : '' ?>" title="Manage Local Services">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span>Manage Local Services</span>
        </a>

        <a href="service-form.php" class="nav-link <?= ($currentPage === 'service-form.php' && !isset($_GET['id'])) ? 'active' : '' ?>" title="Add New Service">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <span>Add New Service</span>
        </a>

        <a href="map.php" class="nav-link <?= ($currentPage === 'map.php') ? 'active' : '' ?>" title="Map View">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            <span>Map View</span>
        </a>
    </nav>

    <div class="sidebar-footer">
        <div class="staff-quick-card" title="<?= htmlspecialchars($currentUser['name'] ?? 'Staff') ?> (Role: <?= ucfirst(htmlspecialchars($currentUser['role'] ?? 'staff')) ?>)">
            <div class="staff-avatar">
                <?= strtoupper(substr($currentUser['name'] ?? 'S', 0, 2)) ?>
            </div>
            <div class="staff-info">
                <span class="staff-name" title="<?= htmlspecialchars($currentUser['name'] ?? 'Staff') ?>">
                    <?= htmlspecialchars($currentUser['name'] ?? 'Staff Member') ?>
                </span>
                <span class="staff-role-badge">
                    Role: <?= ucfirst(htmlspecialchars($currentUser['role'] ?? 'staff')) ?>
                </span>
            </div>
        </div>
    </div>
</aside>
