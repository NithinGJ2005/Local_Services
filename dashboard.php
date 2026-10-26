<?php
/**
 * Aguntaka Pahachana Kendra - Staff Dashboard Overview
 * Streamlined, Action-Oriented Operational Overview
 * Pure PHP + MySQL for XAMPP
 */

$pageTitle = 'Dashboard Overview';
$pageSubtitle = 'Real-time overview of local public service directory';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
require_once __DIR__ . '/includes/topbar.php';

$pdo = Database::getConnection();

// 1. Action-Oriented Metric Counts
$totalServices = (int)$pdo->query("SELECT COUNT(*) FROM local_services")->fetchColumn();
$publishedCount = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE status = 'Published'")->fetchColumn();
$draftCount = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE status = 'Draft'")->fetchColumn();
$missingCoordsCount = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE latitude IS NULL OR longitude IS NULL")->fetchColumn();

// 2. Fetch Latest 5 Recently Updated Services
$recentStmt = $pdo->query("
    SELECT s.id, s.service_name, s.category, s.locality, s.city, s.status, s.updated_at, s.phone
    FROM local_services s
    ORDER BY s.updated_at DESC
    LIMIT 5
");
$recentServices = $recentStmt->fetchAll();

// 3. Compact Category Counts for all 11 Mandated Categories (All non-archived listings)
$catStmt = $pdo->query("
    SELECT category, COUNT(*) as count
    FROM local_services
    WHERE status != 'Archived'
    GROUP BY category
    ORDER BY count DESC
");
$categoryBreakdown = $catStmt->fetchAll();

// Index category counts for fast lookup across all 11 sectors
$catCounts = [];
foreach ($categoryBreakdown as $cb) {
    $catCounts[$cb['category']] = (int)$cb['count'];
}

// Visual icons and badges for the 11 official categories
$categoryMeta = [
    'Hospitals' => ['icon' => '🏥', 'bg' => '#eff6ff', 'border' => '#bfdbfe'],
    'Clinics' => ['icon' => '🩺', 'bg' => '#ecfdf5', 'border' => '#a7f3d0'],
    'Pharmacies' => ['icon' => '💊', 'bg' => '#f0fdfa', 'border' => '#99f6e4'],
    'Police Stations' => ['icon' => '🚔', 'bg' => '#f1f5f9', 'border' => '#cbd5e1'],
    'Fire Stations' => ['icon' => '🚒', 'bg' => '#fff1f2', 'border' => '#fecdd3'],
    'Bus / Transport' => ['icon' => '🚌', 'bg' => '#fffbeb', 'border' => '#fde68a'],
    'Government Offices' => ['icon' => '🏛️', 'bg' => '#f5f3ff', 'border' => '#ddd6fe'],
    'Women & Child Services' => ['icon' => '🛡️', 'bg' => '#fdf2f8', 'border' => '#fbcfe8'],
    'Education' => ['icon' => '🎓', 'bg' => '#f0f9ff', 'border' => '#bae6fd'],
    'Employment' => ['icon' => '💼', 'bg' => '#f8fafc', 'border' => '#e2e8f0'],
    'Legal Services' => ['icon' => '⚖️', 'bg' => '#fff7ed', 'border' => '#fed7aa'],
];

// 4. Published Services with valid coordinates for the Compact Map Preview
$mapStmt = $pdo->query("
    SELECT id, service_name, category, locality, city, latitude, longitude, phone, status
    FROM local_services
    WHERE status = 'Published' AND latitude IS NOT NULL AND longitude IS NOT NULL
    LIMIT 25
");
$mapServices = $mapStmt->fetchAll();
?>

<!-- 1. Four Action-Oriented Summary Metric Cards -->
<div class="stats-grid" style="margin-bottom: 22px;">
    <!-- Card 1: Published / Live in Citizen App -->
    <a href="services.php?status=Published" class="stat-card-link" title="Filter live published services">
        <div class="stat-card">
            <div class="stat-info">
                <span class="stat-label">Published Listings</span>
                <span class="stat-number" style="color:#059669;"><?= $publishedCount ?></span>
                <span class="stat-meta">Live in citizen mobile app</span>
            </div>
            <div class="stat-icon icon-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
        </div>
    </a>

    <!-- Card 2: Drafts Awaiting Action / Review -->
    <a href="services.php?status=Draft" class="stat-card-link" title="Review draft listings">
        <div class="stat-card">
            <div class="stat-info">
                <span class="stat-label">Pending Drafts</span>
                <span class="stat-number" style="color:#d97706;"><?= $draftCount ?></span>
                <span class="stat-meta">Needs verification & publish</span>
            </div>
            <div class="stat-icon icon-amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </div>
        </div>
    </a>

    <!-- Card 3: Missing GPS Coordinates -->
    <a href="services.php?has_coords=0" class="stat-card-link" title="Listings requiring GPS coordinates">
        <div class="stat-card">
            <div class="stat-info">
                <span class="stat-label">Location Not Set</span>
                <span class="stat-number" style="color:#e11d48;"><?= $missingCoordsCount ?></span>
                <span class="stat-meta">Requires map coordinate pin</span>
            </div>
            <div class="stat-icon icon-rose">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            </div>
        </div>
    </a>

    <!-- Card 4: Total Catalogued Directory -->
    <a href="services.php" class="stat-card-link" title="View all local services">
        <div class="stat-card">
            <div class="stat-info">
                <span class="stat-label">Total Services</span>
                <span class="stat-number"><?= $totalServices ?></span>
                <span class="stat-meta">Across 11 public categories</span>
            </div>
            <div class="stat-icon icon-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
            </div>
        </div>
    </a>
</div>

<!-- 2. Main Operational Section: Recently Updated (5 Latest) + Compact Map Preview -->
<div style="display:grid; grid-template-columns: 2fr 1.15fr; gap: 22px; margin-bottom: 22px;">
    <!-- Left: Recently Updated Services (Max 5 items) -->
    <div class="card" style="margin-bottom:0; display:flex; flex-direction:column;">
        <div class="card-header">
            <div>
                <h3 class="card-title">Recently Updated Services</h3>
                <span class="card-subtitle">Showing latest 5 records modified or catalogued</span>
            </div>
            <a href="services.php" class="btn btn-secondary btn-sm">Manage All Services →</a>
        </div>
        <div class="table-responsive" style="flex:1;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Service Name</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th style="text-align:right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($recentServices)): ?>
                        <tr><td colspan="6" style="text-align:center; padding:30px; color:#64748b;">No services recorded yet.</td></tr>
                    <?php else: ?>
                        <?php foreach ($recentServices as $svc): ?>
                            <tr>
                                <td>
                                    <span class="table-service-name"><?= htmlspecialchars($svc['service_name']) ?></span>
                                    <span class="table-subtext">📞 <?= htmlspecialchars($svc['phone']) ?></span>
                                </td>
                                <td>
                                    <a href="services.php?category=<?= urlencode($svc['category']) ?>" class="category-tag" style="text-decoration:none;">
                                        <?= htmlspecialchars($svc['category']) ?>
                                    </a>
                                </td>
                                <td>
                                    <span><?= htmlspecialchars($svc['locality']) ?></span>
                                    <span class="table-subtext"><?= htmlspecialchars($svc['city']) ?></span>
                                </td>
                                <td>
                                    <span class="badge-status status-<?= str_replace(' ', '_', $svc['status']) ?>">
                                        <?= htmlspecialchars($svc['status']) ?>
                                    </span>
                                </td>
                                <td>
                                    <span style="font-size:12px; color:#64748b;">
                                        <?= date('M d, H:i', strtotime($svc['updated_at'])) ?>
                                    </span>
                                </td>
                                <td style="text-align:right;">
                                    <div class="action-buttons-group" style="justify-content: flex-end;">
                                        <button class="btn-icon" title="Customer App Preview" onclick="openServicePreview(<?= $svc['id'] ?>)">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                        <a href="service-form.php?id=<?= $svc['id'] ?>" class="btn-icon" title="Edit Service">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <div style="padding:10px 18px; background:#f8fafc; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:#64748b;">Displaying 5 most recent listings</span>
            <a href="services.php" style="font-size:12px; font-weight:600; color:#2563eb; text-decoration:none;">
                View All Directory (<?= $totalServices ?>) &rarr;
            </a>
        </div>
    </div>

    <!-- Right: Compact Published Services Map Preview -->
    <div class="card" style="margin-bottom:0; display:flex; flex-direction:column;">
        <div class="card-header" style="padding:14px 18px;">
            <div>
                <h3 class="card-title">Published Services Map</h3>
                <span class="card-subtitle"><?= count($mapServices) ?> active locations</span>
            </div>
            <a href="map.php" class="btn btn-outline-primary btn-sm">View Full Map &rarr;</a>
        </div>
        <!-- Reduced Height Map Preview (Compact) -->
        <div class="card-body" style="padding:0; position:relative;">
            <div id="dashboardMap" style="width:100%; height:200px; border-radius:0; position:relative; z-index:1;"></div>
        </div>
        <div style="padding:10px 16px; background:#f8fafc; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11.5px; color:#64748b; display:flex; align-items:center; gap:5px;">
                <span style="width:8px; height:8px; border-radius:50%; background:#10b981; display:inline-block;"></span>
                <?= count($mapServices) ?> Geotagged Pins
            </span>
            <a href="map.php" class="btn btn-primary btn-sm" style="font-size:11.5px; padding:4px 10px;">
                Open Interactive Map &rarr;
            </a>
        </div>
    </div>
</div>

<style>
/* Scoped Category Directory Grid & Card Lift Styles */
.category-directory-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
}
@media (max-width: 1280px) {
    .category-directory-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media (max-width: 768px) {
    .category-directory-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 480px) {
    .category-directory-grid {
        grid-template-columns: 1fr;
    }
}
.cat-tile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    min-height: 58px;
    gap: 8px;
}
.cat-tile:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: translateY(-2px);
    box-shadow: 0 6px 14px -3px rgba(37, 99, 235, 0.16);
}
.cat-tile-left {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
    flex: 1;
}
.cat-tile-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
}
.cat-tile-title {
    font-size: 12.5px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.35;
    word-break: normal;
    overflow-wrap: break-word;
}
.cat-tile:hover .cat-tile-title {
    color: #1d4ed8;
}
.cat-tile-count {
    background: #f1f5f9;
    color: #475569;
    font-size: 11.5px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 99px;
    flex-shrink: 0;
    transition: all 0.2s ease;
}
.cat-tile:hover .cat-tile-count {
    background: #2563eb;
    color: #ffffff;
}
.stat-card-link {
    text-decoration: none;
    display: block;
    color: inherit;
}
.stat-card-link .stat-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    height: 100%;
}
.stat-card-link:hover .stat-card {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px -4px rgba(0, 0, 0, 0.09);
    border-color: #93c5fd;
}
</style>

<!-- 3. Visual Services by Category Grid -->
<div class="card" style="margin-bottom:0; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <div class="card-header" style="padding:15px 20px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
        <div>
            <h3 class="card-title" style="display:flex; align-items:center; gap:8px;">
                <span>Services by Category</span>
                <span style="font-size:11.5px; font-weight:600; background:#eff6ff; color:#2563eb; padding:2px 8px; border-radius:12px;">11 Sectors</span>
            </h3>
            <span class="card-subtitle">Active non-archived listings &bull; Click any tile to filter directory</span>
        </div>
        <a href="services.php" class="btn btn-secondary btn-sm" style="font-size:12px;">Manage All Services &rarr;</a>
    </div>
    <div class="card-body" style="padding:18px 20px;">
        <div class="category-directory-grid">
            <?php foreach (SERVICE_CATEGORIES as $catName): ?>
                <?php 
                    $cnt = $catCounts[$catName] ?? 0;
                    $meta = $categoryMeta[$catName] ?? ['icon' => '📍', 'bg' => '#f1f5f9', 'border' => '#e2e8f0'];
                ?>
                <a href="services.php?category=<?= urlencode($catName) ?>" class="cat-tile" title="View <?= htmlspecialchars($catName) ?> (<?= $cnt ?> listings)">
                    <div class="cat-tile-left">
                        <div class="cat-tile-icon" style="background:<?= $meta['bg'] ?>; border:1px solid <?= $meta['border'] ?>;">
                            <?= $meta['icon'] ?>
                        </div>
                        <span class="cat-tile-title"><?= htmlspecialchars($catName) ?></span>
                    </div>
                    <span class="cat-tile-count"><?= $cnt ?></span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<!-- Dashboard Leaflet Map Initialization Script -->
<script src="assets/js/india-mask.js?v=<?= time() ?>"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('dashboardMap');
    if (!mapElement) return;

    // Centered around Karnataka / India with smooth fractional zoom bounded to India
    const dashMap = L.map('dashboardMap', {
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 120,
        wheelDebounceTime: 40,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        inertia: true,
        inertiaDeceleration: 3000,
        easeLinearity: 0.2,
        maxBounds: [[1.5, 58.0], [42.0, 107.0]],
        maxBoundsViscosity: 0.5,
        minZoom: 3.5
    }).setView([12.9716, 77.5946], 10.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 3.5,
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        keepBuffer: 6,
        updateWhenZooming: false,
        updateWhenIdle: true
    }).addTo(dashMap);

    if (typeof applyIndiaMapMask === 'function') {
        applyIndiaMapMask(dashMap);
    }

    const publishedServices = <?= json_encode($mapServices) ?>;

    publishedServices.forEach(s => {
        if (s.latitude && s.longitude) {
            const marker = L.marker([parseFloat(s.latitude), parseFloat(s.longitude)]).addTo(dashMap);
            marker.bindPopup(`
                <div style="font-family:Inter, sans-serif; padding:4px;">
                    <strong style="font-size:13px; color:#1e3a8a; display:block; margin-bottom:2px;">${escapeHtml(s.service_name)}</strong>
                    <span style="display:inline-block; font-size:10.5px; padding:2px 6px; background:#ecfdf5; color:#065f46; border-radius:4px; font-weight:600; margin-bottom:4px;">${escapeHtml(s.category)}</span><br>
                    <small style="color:#64748b;">📍 ${escapeHtml(s.locality)}, ${escapeHtml(s.city)}</small><br>
                    <small style="color:#64748b;">📞 ${escapeHtml(s.phone)}</small><br>
                    <button onclick="openServicePreview(${s.id})" style="margin-top:6px; background:#2563eb; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; cursor:pointer;">
                        Customer Preview
                    </button>
                </div>
            `);
        }
    });
});
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
