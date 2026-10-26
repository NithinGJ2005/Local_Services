<?php
/**
 * Aguntaka Pahachana Kendra - Reports & Exports Dashboard
 * Pure PHP + MySQL for XAMPP
 */

$pageTitle = 'Reports & Data Exports';
$pageSubtitle = 'Real-time directory analytics, quality audits, and CSV reports';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
require_once __DIR__ . '/includes/topbar.php';

$pdo = Database::getConnection();

// 1. Overall Totals
$totalCount = (int)$pdo->query("SELECT COUNT(*) FROM local_services")->fetchColumn();
$publishedCount = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE status = 'Published'")->fetchColumn();
$unpublishedCount = $totalCount - $publishedCount;

// 2. Status Breakdown
$statusRows = $pdo->query("SELECT status, COUNT(*) as cnt FROM local_services GROUP BY status")->fetchAll();
$statusMap = [];
foreach ($statusRows as $r) {
    $statusMap[$r['status']] = (int)$r['cnt'];
}

// 3. Category Breakdown
$catRows = $pdo->query("SELECT category, COUNT(*) as cnt FROM local_services GROUP BY category ORDER BY cnt DESC")->fetchAll();

// 4. District Breakdown
$distRows = $pdo->query("SELECT district, COUNT(*) as cnt FROM local_services GROUP BY district ORDER BY cnt DESC LIMIT 10")->fetchAll();

// 5. Data Quality Audits
$missingCoords = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE latitude IS NULL OR longitude IS NULL")->fetchColumn();
$missingPhone = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE phone IS NULL OR TRIM(phone) = ''")->fetchColumn();
$staleCount = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE updated_at < DATE_SUB(NOW(), INTERVAL 90 DAY)")->fetchColumn();
$missingFacilities = (int)$pdo->query("SELECT COUNT(*) FROM local_services WHERE facilities IS NULL OR TRIM(facilities) = ''")->fetchColumn();
?>

<!-- Quick Export Bar -->
<div class="filter-bar" style="background:#eff6ff; border-color:#bfdbfe; justify-content:space-between;">
    <div style="display:flex; align-items:center; gap:8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span style="font-weight:600; color:#1e40af; font-size:13.5px;">Download Official CSV Reports:</span>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px;">
        <a href="api/reports.php?export=csv&type=all" class="btn btn-primary btn-sm">
            📥 Complete Directory CSV
        </a>
        <a href="api/reports.php?export=csv&type=published" class="btn btn-secondary btn-sm">
            Published Services Only
        </a>
        <a href="api/reports.php?export=csv&type=missing_coords" class="btn btn-secondary btn-sm" style="color:#b45309;">
            Missing Coordinates List
        </a>
        <a href="api/reports.php?export=csv&type=draft" class="btn btn-secondary btn-sm">
            Draft Services List
        </a>
    </div>
</div>

<!-- High-Level Metric Cards -->
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-info">
            <span class="stat-label">Total Records</span>
            <span class="stat-number"><?= $totalCount ?></span>
            <span class="stat-meta">Active Database Rows</span>
        </div>
        <div class="stat-icon icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-info">
            <span class="stat-label">Published vs Unpublished</span>
            <span class="stat-number" style="font-size:24px;">
                <span style="color:#059669;"><?= $publishedCount ?></span> / <span style="color:#64748b;"><?= $unpublishedCount ?></span>
            </span>
            <span class="stat-meta"><?= $totalCount > 0 ? round(($publishedCount / $totalCount) * 100) : 0 ?>% Live Visibility</span>
        </div>
        <div class="stat-icon icon-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-info">
            <span class="stat-label">Missing Coordinates</span>
            <span class="stat-number" style="color:#d97706;"><?= $missingCoords ?></span>
            <span class="stat-meta">Needs Field GPS Capture</span>
        </div>
        <div class="stat-icon icon-amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-info">
            <span class="stat-label">Missing Phone</span>
            <span class="stat-number" style="color:#dc2626;"><?= $missingPhone ?></span>
            <span class="stat-meta">Cannot Use One-Tap Call</span>
        </div>
        <div class="stat-icon icon-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </div>
    </div>
</div>

<!-- Detailed Data Quality Audit Card -->
<div class="card">
    <div class="card-header">
        <div>
            <h3 class="card-title">Data Quality & Completeness Audits</h3>
            <span class="card-subtitle">Automated checks ensuring accurate service data for citizens</span>
        </div>
    </div>
    <div class="card-body">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:18px;">
            <div style="border:1px solid #e2e8f0; border-radius:10px; padding:18px; background:#f8fafc;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-weight:600; color:#1e293b; font-size:13.5px;">GPS Coordinates Audit</span>
                    <span class="badge-status <?= $missingCoords > 0 ? 'status-Pending' : 'status-Published' ?>">
                        <?= $missingCoords ?> listings missing
                    </span>
                </div>
                <p style="font-size:12px; color:#64748b; line-height:1.4;">
                    Listings without latitude and longitude cannot be positioned on the interactive map or nearby radius search.
                </p>
                <a href="services.php" class="btn btn-secondary btn-sm" style="margin-top:10px; width:100%;">
                    Review in Directory →
                </a>
            </div>

            <div style="border:1px solid #e2e8f0; border-radius:10px; padding:18px; background:#f8fafc;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-weight:600; color:#1e293b; font-size:13.5px;">Contact Phone Audit</span>
                    <span class="badge-status <?= $missingPhone > 0 ? 'status-Inactive' : 'status-Published' ?>">
                        <?= $missingPhone ?> listings missing
                    </span>
                </div>
                <p style="font-size:12px; color:#64748b; line-height:1.4;">
                    Every public service listing should have a working helpline or official telephone number for citizen contact.
                </p>
                <a href="services.php" class="btn btn-secondary btn-sm" style="margin-top:10px; width:100%;">
                    Review in Directory →
                </a>
            </div>

            <div style="border:1px solid #e2e8f0; border-radius:10px; padding:18px; background:#f8fafc;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-weight:600; color:#1e293b; font-size:13.5px;">Stale Records Audit</span>
                    <span class="badge-status status-Draft">
                        <?= $staleCount ?> listings >90 days old
                    </span>
                </div>
                <p style="font-size:12px; color:#64748b; line-height:1.4;">
                    Listings not updated within 90 days should be field-verified by staff to verify telephone and timings.
                </p>
                <a href="services.php" class="btn btn-secondary btn-sm" style="margin-top:10px; width:100%;">
                    Audit Stale Listings →
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Visual Reports: Category Distribution + District Distribution -->
<div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
    <!-- By Category -->
    <div class="card" style="margin-bottom:0;">
        <div class="card-header">
            <div>
                <h3 class="card-title">Services Breakdown by Category</h3>
                <span class="card-subtitle">Distribution across designated service sectors</span>
            </div>
        </div>
        <div class="card-body">
            <div style="display:flex; flex-direction:column; gap:14px;">
                <?php foreach ($catRows as $c): ?>
                    <?php $pct = $totalCount > 0 ? round(($c['cnt'] / $totalCount) * 100) : 0; ?>
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
                            <span style="font-weight:600; color:#1e293b;"><?= htmlspecialchars($c['category']) ?></span>
                            <span style="color:#64748b; font-weight:600;"><?= $c['cnt'] ?> (<?= $pct ?>%)</span>
                        </div>
                        <div style="width:100%; height:8px; background:#f1f5f9; border-radius:99px; overflow:hidden;">
                            <div style="width:<?= $pct ?>%; height:100%; background:#2563eb; border-radius:99px;"></div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <!-- By District -->
    <div class="card" style="margin-bottom:0;">
        <div class="card-header">
            <div>
                <h3 class="card-title">Top Districts by Coverage</h3>
                <span class="card-subtitle">Service distribution in Karnataka administrative divisions</span>
            </div>
        </div>
        <div class="card-body">
            <div style="display:flex; flex-direction:column; gap:14px;">
                <?php foreach ($distRows as $d): ?>
                    <?php $pct = $totalCount > 0 ? round(($d['cnt'] / $totalCount) * 100) : 0; ?>
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
                            <span style="font-weight:600; color:#1e293b;">📍 <?= htmlspecialchars($d['district']) ?></span>
                            <span style="color:#64748b; font-weight:600;"><?= $d['cnt'] ?> listings</span>
                        </div>
                        <div style="width:100%; height:8px; background:#f1f5f9; border-radius:99px; overflow:hidden;">
                            <div style="width:<?= $pct ?>%; height:100%; background:#0ea5e9; border-radius:99px;"></div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
