<?php
/**
 * Aguntaka Pahachana Kendra - Manage Local Services
 * Pure PHP + MySQL for XAMPP
 */

$pageTitle = 'Manage Local Services';
$pageSubtitle = 'Search, review, filter and update local public service listings';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
require_once __DIR__ . '/includes/topbar.php';
?>

<?php
// Pre-parse GET query parameters for instant server-side select state
$selectedCategory = trim($_GET['category'] ?? '');
$selectedStatus = trim($_GET['status'] ?? '');
$selectedDistrict = trim($_GET['district'] ?? '');
$selectedCoords = trim($_GET['has_coords'] ?? '');
$selectedSearch = trim($_GET['search'] ?? '');

$pdo = Database::getConnection();
$catStmt = $pdo->query("SELECT DISTINCT category FROM local_services WHERE category IS NOT NULL AND category != ''");
$dbCats = $catStmt ? $catStmt->fetchAll(PDO::FETCH_COLUMN) : [];
$allCategories = array_values(array_unique(array_merge(SERVICE_CATEGORIES, $dbCats)));
sort($allCategories);
?>

<!-- Filter & Search Toolbar -->
<div class="filter-bar">
    <div class="search-input-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="searchInput" class="form-control" value="<?= htmlspecialchars($selectedSearch) ?>" placeholder="Search by name, category, area, or phone number...">
    </div>

    <!-- Category Filter -->
    <select id="categoryFilter" class="filter-select <?= $selectedCategory !== '' ? 'filter-active-highlight' : '' ?>">
        <option value="">All Categories</option>
        <?php foreach ($allCategories as $cat): ?>
            <option value="<?= htmlspecialchars($cat) ?>" <?= ($selectedCategory === $cat) ? 'selected' : '' ?>>
                <?= htmlspecialchars($cat) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <!-- Status Filter -->
    <select id="statusFilter" class="filter-select <?= $selectedStatus !== '' ? 'filter-active-highlight' : '' ?>">
        <option value="">All Statuses</option>
        <?php foreach (SERVICE_STATUSES as $st): ?>
            <option value="<?= htmlspecialchars($st) ?>" <?= ($selectedStatus === $st) ? 'selected' : '' ?>>
                <?= htmlspecialchars($st) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <!-- District Filter -->
    <select id="districtFilter" class="filter-select <?= $selectedDistrict !== '' ? 'filter-active-highlight' : '' ?>">
        <option value="">All Districts</option>
        <?php foreach (KARNATAKA_DISTRICTS as $dist): ?>
            <option value="<?= htmlspecialchars($dist) ?>" <?= ($selectedDistrict === $dist) ? 'selected' : '' ?>>
                <?= htmlspecialchars($dist) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <!-- Coordinates Filter -->
    <select id="coordsFilter" class="filter-select <?= $selectedCoords !== '' ? 'filter-active-highlight' : '' ?>">
        <option value="">All Coordinates</option>
        <option value="1" <?= $selectedCoords === '1' ? 'selected' : '' ?>>With Map Coordinates</option>
        <option value="0" <?= $selectedCoords === '0' ? 'selected' : '' ?>>Location Not Set (Missing GPS)</option>
    </select>

    <button id="resetFiltersBtn" class="btn btn-secondary btn-sm" title="Clear all filters">
        Reset
    </button>
</div>

<!-- Active Filter Tags Display -->
<div id="activeFilterBadgeContainer" style="display:none; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;"></div>

<!-- Services Data Table Card -->
<div class="card">
    <div class="card-header">
        <div>
            <h3 class="card-title">Local Service Directory</h3>
            <span class="card-subtitle" id="tableRecordSummary">Loading service directory...</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
            <a href="api/reports.php?export=csv&type=all" class="btn btn-secondary btn-sm" title="Export current dataset to CSV">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Export CSV</span>
            </a>
        </div>
    </div>

    <!-- Table Container -->
    <div class="table-responsive">
        <table class="data-table" id="servicesTable">
            <thead>
                <tr>
                    <th>Service Name</th>
                    <th>Category</th>
                    <th>Area / Locality</th>
                    <th>City / District</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Coordinates</th>
                    <th>Last Updated</th>
                    <th style="text-align:right;">Actions</th>
                </tr>
            </thead>
            <tbody id="servicesTableBody">
                <!-- Dynamically populated via assets/js/services.js -->
            </tbody>
        </table>
    </div>

    <!-- Empty State Container (Hidden by default) -->
    <div id="tableEmptyState" class="empty-state" style="display:none;">
        <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </div>
        <h4 class="empty-state-title">No Local Services Found</h4>
        <p class="empty-state-desc">No service listings match your active search or filter criteria. Try resetting filters or adding a new record.</p>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('resetFiltersBtn').click()">Clear Filters</button>
    </div>

    <!-- Loading State Container -->
    <div id="tableLoadingState" style="text-align:center; padding:50px 20px; color:#64748b;">
        <div style="display:inline-block; width:28px; height:28px; border:3px solid #bfdbfe; border-top-color:#2563eb; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
        <p style="margin-top:10px; font-size:13px;">Retrieving service listings...</p>
    </div>

    <!-- Table Record Summary / Footer -->
    <div class="card-header" style="background:#f8fafc; border-top:1px solid var(--border-color); border-bottom:none;">
        <div style="font-size:12.5px; color:#475569;" id="paginationInfo">
            Showing all service listings
        </div>
        <div style="display:none; align-items:center; gap:8px;" id="paginationControls">
            <button class="btn btn-secondary btn-sm" id="prevPageBtn" disabled>← Previous</button>
            <span id="pageIndicator" style="font-size:12.5px; font-weight:600; padding:0 8px;">1</span>
            <button class="btn btn-secondary btn-sm" id="nextPageBtn" disabled>Next →</button>
        </div>
    </div>
</div>

<!-- Modal for Confirming Status Change (Publish / Draft) -->
<div class="modal-backdrop" id="statusActionModal">
    <div class="modal-box">
        <div class="modal-header">
            <h3 class="modal-title" id="statusActionModalTitle">Confirm Status Update</h3>
            <button class="modal-close-btn" onclick="closeModal('statusActionModal')">✕</button>
        </div>
        <div class="modal-body">
            <p id="statusActionModalDesc" style="font-size:13.5px; color:#334155; margin-bottom:14px;"></p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal('statusActionModal')">Cancel</button>
            <button class="btn btn-primary" id="confirmStatusActionBtn">Confirm Action</button>
        </div>
    </div>
</div>

<!-- Modal for Confirming Service Deletion -->
<div class="modal-backdrop" id="deleteServiceModal">
    <div class="modal-box">
        <div class="modal-header" style="border-bottom: 1px solid #fee2e2;">
            <h3 class="modal-title" style="color: #dc2626; display:flex; align-items:center; gap:8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Delete Service Listing</span>
            </h3>
            <button class="modal-close-btn" onclick="closeModal('deleteServiceModal')">✕</button>
        </div>
        <div class="modal-body">
            <p style="font-size:14px; color:#334155; margin-bottom:12px;">
                Are you sure you want to delete <strong id="deleteServiceName" style="color:#0f172a;"></strong>?
            </p>
            <div style="background:#fff1f2; border:1px solid #fecdd3; color:#be123c; padding:12px 14px; border-radius:8px; font-size:12.5px; line-height:1.5;">
                <strong>Warning:</strong> This service listing will be permanently removed from the local directory and citizen app. This action cannot be undone.
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal('deleteServiceModal')">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmDeleteBtn" style="background:#dc2626; border-color:#dc2626; color:#ffffff; font-weight:600;">
                Delete Service
            </button>
        </div>
    </div>
</div>

<style>
@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>

<script>
    // Pass user role to JavaScript for permission gating
    const CURRENT_USER_ROLE = "<?= htmlspecialchars($currentUser['role'] ?? 'staff') ?>";
</script>
<script src="assets/js/services.js?v=<?= filemtime(__DIR__ . '/assets/js/services.js') ?>"></script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
