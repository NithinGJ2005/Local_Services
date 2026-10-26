<?php
/**
 * Aguntaka Pahachana Kendra - Service Details & Customer App Preview
 * Pure PHP + MySQL for XAMPP
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/auth.php';
require_once __DIR__ . '/config/constants.php';

Auth::requireAuth();
$currentUser = Auth::user();
$pdo = Database::getConnection();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if (!$id) {
    header('Location: services.php');
    exit;
}

$stmt = $pdo->prepare("
    SELECT s.*, 
           cu.name AS creator_name, cu.email AS creator_email, cu.role AS creator_role,
           uu.name AS updater_name, uu.email AS updater_email, uu.role AS updater_role
    FROM local_services s
    LEFT JOIN staff_users cu ON s.created_by = cu.id
    LEFT JOIN staff_users uu ON s.updated_by = uu.id
    WHERE s.id = ?
    LIMIT 1
");
$stmt->execute([$id]);
$service = $stmt->fetch();

if (!$service) {
    header('Location: services.php');
    exit;
}



$pageTitle = htmlspecialchars($service['service_name']);
$pageSubtitle = "Service Details & Customer Preview (Record #{$service['id']})";
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
require_once __DIR__ . '/includes/topbar.php';
?>

<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
    <div style="display:flex; align-items:center; gap:12px;">
        <a href="services.php" class="btn btn-secondary btn-sm">← Back to Directory</a>
        <span class="badge-status status-<?= str_replace(' ', '_', $service['status']) ?>" style="font-size:13px; padding:4px 12px;">
            <?= htmlspecialchars($service['status']) ?>
        </span>
    </div>
    <div style="display:flex; align-items:center; gap:10px;">
        <a href="service-form.php?id=<?= $service['id'] ?>" class="btn btn-primary btn-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Edit Listing</span>
        </a>
    </div>
</div>

<div style="display:grid; grid-template-columns: 1.3fr 1fr; gap:24px; align-items:start;">
    
    <!-- LEFT: Staff Administrative Data & Internal Details -->
    <div>
        <!-- Main Info Card -->
        <div class="card">
            <div class="card-header">
                <div>
                    <h3 class="card-title"><?= htmlspecialchars($service['service_name']) ?></h3>
                    <span class="category-tag" style="margin-top:4px;"><?= htmlspecialchars($service['category']) ?></span>
                </div>
                <span style="font-size:12px; color:#64748b;">ID: #<?= $service['id'] ?></span>
            </div>
            <div class="card-body">
                <h4 style="font-size:14px; font-weight:600; color:#1e293b; margin-bottom:8px;">Description</h4>
                <p style="color:#475569; font-size:13.5px; line-height:1.6; margin-bottom:18px;">
                    <?= nl2br(htmlspecialchars($service['description'] ?: ($service['short_description'] ?: 'No description entered.'))) ?>
                </p>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:18px;">
                    <div>
                        <span style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase;">Primary Phone</span>
                        <div style="font-size:14px; font-weight:600; color:#0f172a; margin-top:2px;">
                            📞 <?= htmlspecialchars($service['phone']) ?>
                        </div>
                    </div>
                    <?php if (!empty($service['alternate_phone'])): ?>
                        <div>
                            <span style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase;">Alternate Phone</span>
                            <div style="font-size:14px; color:#0f172a; margin-top:2px;">
                                <?= htmlspecialchars($service['alternate_phone']) ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($service['email'])): ?>
                        <div>
                            <span style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase;">Official Email</span>
                            <div style="font-size:13.5px; color:#2563eb; margin-top:2px;">
                                <?= htmlspecialchars($service['email']) ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($service['website'])): ?>
                        <div>
                            <span style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase;">Official Website</span>
                            <div style="font-size:13.5px; margin-top:2px;">
                                <a href="<?= htmlspecialchars($service['website']) ?>" target="_blank" rel="noopener noreferrer">Visit Portal ↗</a>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <?php if (!empty($service['file_url'])): ?>
                    <div style="border-top:1px solid #f1f5f9; padding-top:16px; margin-bottom:18px;">
                        <span style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase; display:block; margin-bottom:8px;">Attached Document / File</span>
                        <div style="display:flex; align-items:center; gap:12px; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
                            <?php if (preg_match('/\.(jpg|jpeg|png|webp|gif|svg)$/i', $service['file_url'])): ?>
                                <img src="<?= htmlspecialchars($service['file_url']) ?>" alt="Attached file" style="width:48px; height:48px; object-fit:cover; border-radius:6px; border:1px solid #cbd5e1;">
                            <?php else: ?>
                                <div style="width:40px; height:40px; background:#eff6ff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:20px;">📄</div>
                            <?php endif; ?>
                            <div style="flex:1; overflow:hidden;">
                                <div style="font-weight:600; font-size:13px; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                    <?= htmlspecialchars($service['file_name'] ?: basename($service['file_url'])) ?>
                                </div>
                                <div style="font-size:11.5px; color:#64748b; margin-top:2px;">
                                    <?= htmlspecialchars($service['file_type'] ?: 'File Attachment') ?>
                                </div>
                            </div>
                            <a href="<?= htmlspecialchars($service['file_url']) ?>" target="_blank" class="btn btn-secondary btn-sm" style="font-size:12px; font-weight:600; padding:6px 12px;">
                                View / Open ↗
                            </a>
                        </div>
                    </div>
                <?php endif; ?>

                <div style="border-top:1px solid #f1f5f9; padding-top:16px; margin-bottom:18px;">
                    <span style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase; display:block; margin-bottom:6px;">Address & Geo-Location</span>
                    <div style="font-size:13.5px; color:#1e293b; line-height:1.5;">
                        <?= htmlspecialchars($service['address_line']) ?><br>
                        <?= htmlspecialchars($service['locality']) ?>, <?= htmlspecialchars($service['city']) ?>, <?= htmlspecialchars($service['district']) ?>, <?= htmlspecialchars($service['state']) ?> - <?= htmlspecialchars($service['pincode'] ?? '') ?>
                    </div>
                    <div style="margin-top:8px; font-size:12px; color:#64748b;">
                        <?php if ($service['latitude'] && $service['longitude']): ?>
                            <span style="color:#059669; font-weight:600;">📍 Coordinates: <?= $service['latitude'] ?>, <?= $service['longitude'] ?></span>
                        <?php else: ?>
                            <span style="color:#d97706; font-weight:600;">⚠️ Location not set (Missing GPS coordinates)</span>
                        <?php endif; ?>
                    </div>
                </div>

                <div style="border-top:1px solid #f1f5f9; padding-top:16px; margin-bottom:18px;">
                    <span style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase; display:block; margin-bottom:6px;">Working Hours & Availability</span>
                    <div style="font-size:13.5px; color:#1e293b;">
                        <?php if ($service['is_24_hours']): ?>
                            <span style="color:#059669; font-weight:700;">🟢 24-Hour Continuous Emergency Service</span>
                        <?php else: ?>
                            <span>Hours: <?= $service['opening_time'] ? substr($service['opening_time'], 0, 5) : 'N/A' ?> to <?= $service['closing_time'] ? substr($service['closing_time'], 0, 5) : 'N/A' ?></span>
                            <span style="color:#64748b; margin-left:8px;">(<?= htmlspecialchars($service['working_days'] ?? 'Mon - Sat') ?>)</span>
                        <?php endif; ?>
                    </div>
                    <?php if (!empty($service['availability_notes'])): ?>
                        <div style="font-size:12px; color:#64748b; margin-top:4px;">
                            Note: <?= htmlspecialchars($service['availability_notes']) ?>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Internal Staff Section (Shielded from customer) -->
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
                    <span style="font-size:12px; font-weight:700; color:#1e40af; text-transform:uppercase; display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                        🔒 Staff Internal Review & Audit Data
                    </span>
                    <?php if (!empty($service['internal_notes'])): ?>
                        <div style="font-size:13px; color:#334155; margin-bottom:8px;">
                            <strong>Internal Notes:</strong> <?= htmlspecialchars($service['internal_notes']) ?>
                        </div>
                    <?php endif; ?>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:11.5px; color:#64748b; margin-top:10px; border-top:1px solid #e2e8f0; padding-top:10px;">
                        <div>Created by: <?= htmlspecialchars($service['creator_name'] ?? 'System') ?> (<?= $service['created_at'] ?>)</div>
                        <div>Last updated: <?= htmlspecialchars($service['updater_name'] ?? 'System') ?> (<?= $service['updated_at'] ?>)</div>
                    </div>
                </div>
            </div>
        </div>


    </div>

    <!-- RIGHT: Customer App Live Mobile Preview -->
    <div>
        <div style="text-align:center; margin-bottom:12px;">
            <span style="font-size:13px; font-weight:700; color:#1e40af; text-transform:uppercase; letter-spacing:0.5px;">
                📱 Live Customer App View
            </span>
            <p style="font-size:11.5px; color:#64748b; margin-top:2px;">
                Verified rendering shown to users in the Aguntaka mobile application.
            </p>
        </div>

        <div class="preview-card" style="margin:0 auto;">
            <div class="preview-phone-header">
                <div style="width:38px; height:38px; border-radius:50%; background:#2563eb; display:flex; align-items:center; justify-content:center; color:#fff; font-size:18px;">
                    🏥
                </div>
                <div>
                    <h4 style="color:#ffffff; font-size:15px; margin:0; line-height:1.2;">
                        <?= htmlspecialchars($service['service_name']) ?>
                    </h4>
                    <span style="color:#93c5fd; font-size:11px;">
                        <?= htmlspecialchars($service['locality']) ?>, <?= htmlspecialchars($service['city']) ?>
                    </span>
                </div>
            </div>

            <div class="preview-phone-body">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <span class="badge-status status-<?= str_replace(' ', '_', $service['status']) ?>">
                        <?= htmlspecialchars($service['status']) ?>
                    </span>
                    <span style="font-size:11.5px; color:#64748b; font-weight:600;">
                        <?= $service['is_24_hours'] ? 'Open 24 Hours' : ($service['opening_time'] ? substr($service['opening_time'], 0, 5) . ' - ' . substr($service['closing_time'], 0, 5) : 'Regular Hours') ?>
                    </span>
                </div>

                <p style="font-size:13px; color:#334155; margin-bottom:14px; line-height:1.4;">
                    <?= htmlspecialchars($service['short_description'] ?: ($service['description'] ?: 'Public service listing')) ?>
                </p>

                <!-- Customer Three Action Buttons -->
                <div class="preview-action-row">
                    <a href="tel:<?= htmlspecialchars($service['phone']) ?>" class="preview-action-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>Call</span>
                    </a>

                    <?php 
                        $dirUrl = ($service['latitude'] && $service['longitude']) 
                            ? "https://www.google.com/maps/dir/?api=1&destination={$service['latitude']},{$service['longitude']}"
                            : "https://www.google.com/maps/search/?api=1&query=" . urlencode($service['service_name'] . ', ' . $service['locality'] . ', ' . $service['city']);
                    ?>
                    <a href="<?= $dirUrl ?>" target="_blank" rel="noopener noreferrer" class="preview-action-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                        <span>Directions</span>
                    </a>

                    <a href="#info" class="preview-action-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <span>Info</span>
                    </a>
                </div>

                <!-- Info Cards -->
                <div class="preview-info-box">
                    <div class="preview-info-title">Location & Address</div>
                    <div style="font-size:12.5px; color:#1e293b;">
                        <?= htmlspecialchars($service['address_line']) ?>, <?= htmlspecialchars($service['locality']) ?>, <?= htmlspecialchars($service['city']) ?> - <?= htmlspecialchars($service['pincode'] ?? '') ?>
                    </div>
                </div>

                <div class="preview-info-box">
                    <div class="preview-info-title">Facilities & Amenities</div>
                    <div style="font-size:12.5px; color:#1e293b;">
                        <?= htmlspecialchars($service['facilities'] ?: 'Standard public service facilities.') ?>
                    </div>
                </div>

                <?php if (!empty($service['accessibility_notes']) || !empty($service['public_notes'])): ?>
                    <div class="preview-info-box">
                        <div class="preview-info-title">Public Instructions</div>
                        <div style="font-size:12.5px; color:#1e293b;">
                            <?= htmlspecialchars($service['accessibility_notes'] ?? '') ?> 
                            <?= htmlspecialchars($service['public_notes'] ?? '') ?>
                        </div>
                    </div>
                <?php endif; ?>

                <div style="padding:10px; border-radius:6px; background:#eff6ff; border:1px dashed #93c5fd; font-size:11px; color:#1e40af; text-align:center;">
                    🛡️ Notice: Internal verification records, staff identity, and audit remarks are strictly excluded from citizen view.
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
