<?php
/**
 * Aguntaka Pahachana Kendra - Interactive Map View
 * Pure PHP + Leaflet OpenStreetMap (Zero Node.js, Zero API Keys required)
 */

$pageTitle = 'Interactive Map View';
$pageSubtitle = 'Visual geo-spatial map of local public services across India';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
require_once __DIR__ . '/includes/topbar.php';

$pdo = Database::getConnection();

// 1. Fetch all services with valid coordinates
$mapStmt = $pdo->query("
    SELECT id, service_name, category, locality, city, district, address_line, 
           latitude, longitude, phone, status, is_24_hours
    FROM local_services
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    ORDER BY service_name ASC
");
$geoServices = $mapStmt->fetchAll();

// 2. Fetch services without coordinates (Spec: Graceful fallback and clear 'Location not set' listing)
$missingStmt = $pdo->query("
    SELECT id, service_name, category, locality, city, district, address_line, status, phone
    FROM local_services
    WHERE latitude IS NULL OR longitude IS NULL
    ORDER BY service_name ASC
");
$missingServices = $missingStmt->fetchAll();

// Dynamic categories
$mapCatStmt = $pdo->query("SELECT DISTINCT category FROM local_services WHERE category IS NOT NULL AND category != ''");
$mapDbCats = $mapCatStmt ? $mapCatStmt->fetchAll(PDO::FETCH_COLUMN) : [];
$allMapCategories = array_values(array_unique(array_merge(SERVICE_CATEGORIES, $mapDbCats)));
sort($allMapCategories);
?>

<!-- Filter Pills / Controls -->
<div class="filter-bar" style="justify-content:space-between;">
    <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <span style="font-weight:600; font-size:13px; color:#1e293b;">Category Filter:</span>
        <select id="mapCategoryFilter" class="filter-select" style="min-width:180px;">
            <option value="">All Categories (<?= count($geoServices) ?> pins)</option>
            <?php foreach ($allMapCategories as $cat): ?>
                <option value="<?= htmlspecialchars($cat) ?>"><?= htmlspecialchars($cat) ?></option>
            <?php endforeach; ?>
        </select>

        <select id="mapStatusFilter" class="filter-select" style="min-width:150px;">
            <option value="">All Statuses</option>
            <?php foreach (SERVICE_STATUSES as $st): ?>
                <option value="<?= htmlspecialchars($st) ?>"><?= htmlspecialchars($st) ?></option>
            <?php endforeach; ?>
        </select>
    </div>

    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <span style="font-size:12.5px; color:#64748b; margin-right:4px;">
            Showing <strong id="activePinCount" style="color:#2563eb;"><?= count($geoServices) ?></strong> mapped locations
        </span>
        <button id="focusPinsBtn" class="btn btn-secondary btn-sm" title="Focus zoom on active service pins">
            📍 Focus Pins
        </button>
        <button id="resetMapCenterBtn" class="btn btn-primary btn-sm" title="Fit Entire India into View">
            🇮🇳 View Full India
        </button>
    </div>
</div>

<!-- Leaflet Map Container -->
<div class="card" style="margin-bottom:28px;">
    <div class="card-body" style="padding:0;">
        <div id="fullMapView" class="leaflet-map-wrapper" style="height: 600px;"></div>
    </div>
</div>

<!-- Graceful Fallback Section: Services Without Coordinates (Spec 5.F) -->
<div class="card">
    <div class="card-header" style="background:#fffbeb; border-color:#fde68a;">
        <div>
            <h3 class="card-title" style="color:#92400e;">
                ⚠️ Listings Missing Geo-Coordinates (Location Not Set: <?= count($missingServices) ?>)
            </h3>
            <span class="card-subtitle" style="color:#b45309;">
                As mandated by the specification, services without verified latitude/longitude are omitted from map pins to prevent fabricated coordinates. Staff can assign coordinates below.
            </span>
        </div>
    </div>
    <div class="table-responsive">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Service Name</th>
                    <th>Category</th>
                    <th>Address / Locality</th>
                    <th>City / District</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th style="text-align:right;">Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($missingServices)): ?>
                    <tr>
                        <td colspan="7" style="text-align:center; padding:24px; color:#059669; font-weight:600;">
                            ✓ All services in the directory currently have valid geographic coordinates!
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($missingServices as $ms): ?>
                        <tr>
                            <td>
                                <span class="table-service-name"><?= htmlspecialchars($ms['service_name']) ?></span>
                                <span class="table-subtext">ID: #<?= $ms['id'] ?></span>
                            </td>
                            <td>
                                <span class="category-tag"><?= htmlspecialchars($ms['category']) ?></span>
                            </td>
                            <td>
                                <span><?= htmlspecialchars($ms['address_line']) ?></span>
                                <span class="table-subtext"><?= htmlspecialchars($ms['locality']) ?></span>
                            </td>
                            <td>
                                <span><?= htmlspecialchars($ms['city']) ?></span>
                                <span class="table-subtext"><?= htmlspecialchars($ms['district']) ?></span>
                            </td>
                            <td>
                                <span style="font-family:monospace; font-size:12px;"><?= htmlspecialchars($ms['phone']) ?></span>
                            </td>
                            <td>
                                <span class="badge-status status-<?= str_replace(' ', '_', $ms['status']) ?>">
                                    <?= htmlspecialchars($ms['status']) ?>
                                </span>
                            </td>
                            <td style="text-align:right;">
                                <a href="service-form.php?id=<?= $ms['id'] ?>#formMapPicker" class="btn btn-outline-primary btn-sm">
                                    📍 Pick Location on Map
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<script src="assets/js/india-mask.js?v=<?= time() ?>"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const rawServices = <?= json_encode($geoServices) ?>;
    const catSelect = document.getElementById('mapCategoryFilter');
    const statusSelect = document.getElementById('mapStatusFilter');
    const countEl = document.getElementById('activePinCount');
    const resetCenterBtn = document.getElementById('resetMapCenterBtn');

    // India Center & Full Country Bounding Box (Ladakh to Kanyakumari, Gujarat to Arunachal)
    const INDIA_BOUNDS = [[6.5, 68.0], [37.5, 97.5]];
    const INDIA_MAX_BOUNDS = [[1.5, 58.0], [42.0, 107.0]];
    const focusPinsBtn = document.getElementById('focusPinsBtn');

    // Smooth Fractional Zoom & Kinetic Scrolling Map Instance
    const map = L.map('fullMapView', {
        zoomSnap: 0.25,           // Fractional zoom: allows micro-zoom levels
        zoomDelta: 0.5,           // Smooth zoom steps on buttons and wheel
        wheelPxPerZoomLevel: 100, // Silky smooth mouse wheel scaling
        wheelDebounceTime: 30,    // Responsive wheel scroll response
        zoomAnimation: true,
        zoomAnimationThreshold: 4,
        fadeAnimation: true,
        markerZoomAnimation: true,
        inertia: true,
        inertiaDeceleration: 3000,
        easeLinearity: 0.2,
        maxBounds: INDIA_MAX_BOUNDS,
        maxBoundsViscosity: 0.5,
        minZoom: 3.5
    });

    // High performance buffered tile layer with expansive zoom range
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 3.5,
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        keepBuffer: 6,
        updateWhenZooming: false,
        updateWhenIdle: true
    }).addTo(map);

    // Apply Solid Inverted Mask: clean, natural background outside India without harsh blue lines
    if (typeof applyIndiaMapMask === 'function') {
        applyIndiaMapMask(map);
    }

    let markerLayer = L.layerGroup().addTo(map);
    let allInitialBounds = [];

    function renderPins(isFirstRun = false) {
        markerLayer.clearLayers();
        const selectedCat = catSelect.value;
        const selectedStatus = statusSelect.value;
        let visibleCount = 0;
        const latLngBounds = [];

        rawServices.forEach(s => {
            if (selectedCat && s.category !== selectedCat) return;
            if (selectedStatus && s.status !== selectedStatus) return;

            const lat = parseFloat(s.latitude);
            const lng = parseFloat(s.longitude);

            if (isNaN(lat) || isNaN(lng)) return;

            visibleCount++;
            latLngBounds.push([lat, lng]);

            const marker = L.marker([lat, lng]);

            // Smooth zoom-in / fly-to on marker click
            marker.on('click', () => {
                map.flyTo([lat, lng], Math.max(map.getZoom(), 14), {
                    duration: 0.6,
                    easeLinearity: 0.25
                });
            });
            
            // Rich Popup
            const popupHtml = `
                <div style="font-family:Inter, sans-serif; min-width:210px; padding:4px;">
                    <strong style="font-size:13.5px; color:#1e3a8a; display:block; margin-bottom:2px;">${escapeHtml(s.service_name)}</strong>
                    <div style="margin-bottom:6px;">
                        <span class="category-tag" style="font-size:10.5px;">${escapeHtml(s.category)}</span>
                        <span class="badge-status status-${escapeHtml(s.status.replace(/\\s+/g, '_'))}" style="font-size:10px; padding:1px 6px;">${escapeHtml(s.status)}</span>
                    </div>
                    <div style="font-size:12px; color:#334155; margin-bottom:4px;">
                        📍 ${escapeHtml(s.address_line)}, ${escapeHtml(s.locality)}, ${escapeHtml(s.city)}
                    </div>
                    <div style="font-size:11.5px; color:#64748b; margin-bottom:8px;">
                        📞 ${escapeHtml(s.phone)} ${s.is_24_hours == 1 ? '• 24/7 Service' : ''}
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button onclick="openServicePreview(${s.id})" style="flex:1; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; padding:5px 8px; border-radius:4px; font-size:11.5px; font-weight:600; cursor:pointer;">
                            📱 Customer App View
                        </button>
                        <a href="service-view.php?id=${s.id}" style="background:#2563eb; color:#ffffff; padding:5px 8px; border-radius:4px; font-size:11.5px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center;">
                            Details →
                        </a>
                    </div>
                </div>
            `;

            marker.bindPopup(popupHtml);
            markerLayer.addLayer(marker);
        });

        if (countEl) countEl.textContent = visibleCount;

        if (isFirstRun) {
            allInitialBounds = latLngBounds;
            // Initially zoom in on the center of active services (do not display whole country initially)
            if (latLngBounds.length > 0) {
                map.fitBounds(latLngBounds, { padding: [50, 50], maxZoom: 11 });
            } else {
                map.setView([20.5937, 78.9629], 6.5);
            }
        } else if (latLngBounds.length > 0 && (selectedCat || selectedStatus)) {
            map.fitBounds(latLngBounds, { padding: [50, 50], maxZoom: 13, animate: true, duration: 0.6 });
        }
    }

    renderPins(true);

    if (catSelect) catSelect.addEventListener('change', () => renderPins(false));
    if (statusSelect) statusSelect.addEventListener('change', () => renderPins(false));

    if (resetCenterBtn) {
        resetCenterBtn.addEventListener('click', () => {
            // View full India in all its extent
            map.fitBounds(INDIA_BOUNDS, { padding: [15, 15], animate: true, duration: 0.7 });
        });
    }

    if (focusPinsBtn) {
        focusPinsBtn.addEventListener('click', () => {
            if (allInitialBounds && allInitialBounds.length > 0) {
                map.fitBounds(allInitialBounds, { padding: [50, 50], maxZoom: 13, animate: true, duration: 0.7 });
            }
        });
    }
});
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
