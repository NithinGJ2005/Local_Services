<?php
/**
 * Aguntaka Pahachana Kendra - Add / Edit Local Service Form
 * Pure PHP + MySQL for XAMPP
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/auth.php';
require_once __DIR__ . '/config/constants.php';

Auth::requireAuth();
$currentUser = Auth::user();
$pdo = Database::getConnection();

$serviceId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$isEdit = ($serviceId > 0);

$pageTitle = $isEdit ? 'Edit Local Service Listing' : 'Add New Local Service';
$pageSubtitle = $isEdit ? "Modifying record #{$serviceId}" : 'Create verified nearby service record';

// Prepopulate data if editing
$service = [
    'id' => 0,
    'service_name' => '',
    'category' => '',
    'short_description' => '',
    'description' => '',
    'file_url' => '',
    'file_name' => '',
    'file_type' => '',
    'image_url' => '',
    'phone' => '',
    'alternate_phone' => '',
    'email' => '',
    'website' => '',
    'contact_person' => '',
    'address_line' => '',
    'locality' => '',
    'city' => 'Bengaluru',
    'district' => 'Bengaluru Urban',
    'state' => 'Karnataka',
    'pincode' => '',
    'latitude' => '',
    'longitude' => '',
    'opening_time' => '',
    'closing_time' => '',
    'working_days' => 'Mon - Sat',
    'is_24_hours' => 0,
    'availability_notes' => '',
    'facilities' => '',
    'accessibility_notes' => '',
    'public_notes' => '',
    'internal_notes' => '',
    'status' => 'Draft'
];

if ($isEdit) {
    $stmt = $pdo->prepare("SELECT * FROM local_services WHERE id = ?");
    $stmt->execute([$serviceId]);
    $existing = $stmt->fetch();
    if (!$existing) {
        header('Location: services.php');
        exit;
    }
    $service = array_merge($service, $existing);
}

$isCustomCategory = (!empty($service['category']) && !in_array($service['category'], SERVICE_CATEGORIES));

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
require_once __DIR__ . '/includes/topbar.php';
?>

<!-- Duplicate Warning Banner -->
<div id="duplicateWarningBox" class="duplicate-warning-banner">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
    <div style="flex:1;">
        <strong>Potential Duplicate Warning:</strong>
        <span id="duplicateWarningText">A listing with a similar name or address was found in the directory.</span>
        <div id="duplicateMatchesList" style="margin-top:4px; font-size:12px;"></div>
    </div>
</div>

<form id="serviceForm" method="POST" novalidate>
    <input type="hidden" id="serviceId" value="<?= $service['id'] ?>">

    <!-- Language Switch Button Only -->
    <div class="lang-switch-bar">
        <div class="lang-toggle-pill-group" role="group" aria-label="Language Switch">
            <button type="button" id="langBtnEn" class="lang-pill-btn active" data-lang="en" title="English">
                <span>🇬🇧</span> English
            </button>
            <button type="button" id="langSwapBtn" class="lang-swap-btn" title="Switch Language (English ⇄ ಕನ್ನಡ)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 3 21 8 16 13"></polyline>
                    <line x1="21" y1="8" x2="3" y2="8"></line>
                    <polyline points="8 21 3 16 8 11"></polyline>
                    <line x1="3" y1="16" x2="21" y2="16"></line>
                </svg>
            </button>
            <button type="button" id="langBtnKn" class="lang-pill-btn" data-lang="kn" title="ಕನ್ನಡ">
                <span>🇮🇳</span> ಕನ್ನಡ
            </button>
        </div>
    </div>

    <!-- SECTION 1: Basic Information -->
    <div class="form-section">
        <div class="form-section-header">
            <h2 class="form-section-title" id="sec_title_1">1. Basic Information</h2>
            <p class="form-section-desc" id="sec_desc_1">Primary name and classification displayed prominently in the customer application.</p>
        </div>
        <div class="form-grid">
            <div class="col-8 form-group">
                <label class="form-label required" id="lbl_service_name" for="service_name">Official Service Name</label>
                <input type="text" id="service_name" name="service_name" class="form-control" 
                       value="<?= htmlspecialchars($service['service_name']) ?>" 
                       placeholder="e.g. Victoria Hospital Government Healthcare Center" required>
                <div class="invalid-feedback" id="err_service_name"></div>
            </div>

            <div class="col-4 form-group">
                <label class="form-label required" id="lbl_category" for="category">Service Category</label>
                <select id="category" name="category" class="form-control" required>
                    <option value="" id="opt_category_default">Select Category...</option>
                    <?php foreach (SERVICE_CATEGORIES as $cat): ?>
                        <option value="<?= htmlspecialchars($cat) ?>" <?= ($service['category'] === $cat) ? 'selected' : '' ?>>
                            <?= htmlspecialchars($cat) ?>
                        </option>
                    <?php endforeach; ?>
                    <option value="Other" id="opt_category_other" <?= $isCustomCategory ? 'selected' : '' ?>>Other</option>
                </select>
                <div class="invalid-feedback" id="err_category"></div>

                <div id="customCategoryWrapper" style="margin-top: 10px; <?= $isCustomCategory ? '' : 'display: none;' ?>">
                    <label class="form-label required" id="lbl_custom_category" for="custom_category" style="font-size: 12px; font-weight: 600; color: #1e293b; margin-bottom: 4px; display: block;">Specify Service Category</label>
                    <input type="text" id="custom_category" name="custom_category" class="form-control" 
                           value="<?= $isCustomCategory ? htmlspecialchars($service['category']) : '' ?>" 
                           placeholder="Type your service category...">
                    <div class="invalid-feedback" id="err_custom_category"></div>
                </div>
            </div>

            <div class="col-12 form-group">
                <label class="form-label" id="lbl_short_description" for="short_description">Short Summary (1-2 sentences)</label>
                <input type="text" id="short_description" name="short_description" class="form-control" 
                       value="<?= htmlspecialchars($service['short_description'] ?? '') ?>" 
                       placeholder="e.g. Tertiary government hospital with emergency trauma care.">
            </div>

            <div class="col-12 form-group">
                <label class="form-label" id="lbl_description" for="description">Full Description / Services Offered</label>
                <textarea id="description" name="description" class="form-control" rows="4" 
                          placeholder="Detailed information visible when customer opens the service card..."><?= htmlspecialchars($service['description'] ?? '') ?></textarea>
            </div>

            <div class="col-12 form-group">
                <?php 
                    $fileUrl = $service['file_url'] ?? $service['image_url'] ?? ''; 
                    $fileName = $service['file_name'] ?? (!empty($fileUrl) ? basename($fileUrl) : '');
                    $fileType = $service['file_type'] ?? '';
                ?>
                <label class="form-label" id="lbl_image_url" for="serviceFileInput">Service Image, Logo, or Document <span style="font-size:0.78rem; color:#64748b; font-weight:normal;">(Optional - Upload any file from device)</span></label>
                <input type="hidden" id="file_url" name="file_url" value="<?= htmlspecialchars($fileUrl) ?>">
                <input type="hidden" id="file_name" name="file_name" value="<?= htmlspecialchars($fileName) ?>">
                <input type="hidden" id="file_type" name="file_type" value="<?= htmlspecialchars($fileType) ?>">
                <input type="hidden" id="image_url" name="image_url" value="<?= htmlspecialchars($fileUrl) ?>">
                
                <div class="file-dropzone-container" id="fileDropzone">
                    <input type="file" id="serviceFileInput" class="file-hidden-input" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onchange="handleFileUpload(this)">
                    
                    <!-- Empty / Prompt State -->
                    <div class="dropzone-content" id="dropzonePrompt" style="<?= !empty($fileUrl) ? 'display:none;' : '' ?>">
                        <div class="dropzone-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <div style="font-weight:600; font-size:13.5px; color:#1e293b; margin-top:4px;">
                            Click to upload or drag & drop any file from your device
                        </div>
                        <div style="font-size:11.5px; color:#64748b; margin-top:2px;">
                            Supports Images (JPG, PNG, WebP), PDFs, or Documents (Max 25MB)
                        </div>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('serviceFileInput').click()" style="margin-top:10px; font-weight:600; padding:6px 16px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Choose File
                        </button>
                    </div>

                    <!-- Attached / Preview State -->
                    <div class="dropzone-attached-box" id="dropzoneAttached" style="<?= !empty($fileUrl) ? '' : 'display:none;' ?>">
                        <div class="attached-preview-thumb" id="attachedThumb">
                            <?php if (!empty($fileUrl)): ?>
                                <?php if (preg_match('/\.(jpg|jpeg|png|webp|gif|svg)$/i', $fileUrl)): ?>
                                    <img src="<?= htmlspecialchars($fileUrl) ?>" alt="Preview" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">
                                <?php else: ?>
                                    <span style="font-size:22px;">📄</span>
                                <?php endif; ?>
                            <?php endif; ?>
                        </div>
                        <div style="flex:1; overflow:hidden;">
                            <div style="font-weight:600; font-size:13px; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" id="attachedFileName">
                                <?= !empty($fileName) ? htmlspecialchars($fileName) : 'No file selected' ?>
                            </div>
                            <div style="font-size:11px; color:#16a34a; margin-top:2px;" id="attachedFileStatus">
                                <?= !empty($fileUrl) ? '✓ File attached' : '' ?>
                            </div>
                        </div>
                        <div style="display:flex; gap:6px; flex-shrink:0;">
                            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('serviceFileInput').click()" title="Replace file" style="padding:4px 10px; font-size:11.5px;">
                                Change
                            </button>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="removeAttachedFile()" title="Remove file" style="padding:4px 8px; color:#ef4444; font-size:12px;">
                                ✕
                            </button>
                        </div>
                    </div>

                    <!-- Uploading Progress Bar -->
                    <div id="uploadProgressContainer" style="display:none; margin-top:10px; width:100%; text-align:left;">
                        <div style="height:5px; width:100%; background:#e2e8f0; border-radius:3px; overflow:hidden;">
                            <div id="uploadProgressBar" style="height:100%; width:0%; background:#2563eb; transition:width 0.2s;"></div>
                        </div>
                        <div style="font-size:11px; color:#2563eb; margin-top:4px; font-weight:600;" id="uploadProgressText">Uploading file...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION 2: Contact Information -->
    <div class="form-section">
        <div class="form-section-header">
            <h2 class="form-section-title" id="sec_title_2">2. Contact Information</h2>
            <p class="form-section-desc" id="sec_desc_2">Public communication channels for citizen inquiries and emergency calls.</p>
        </div>
        <div class="form-grid">
            <div class="col-6 form-group">
                <label class="form-label required" id="lbl_phone" for="phone">Public Contact Number (Primary Phone)</label>
                <input type="text" id="phone" name="phone" class="form-control" 
                       value="<?= htmlspecialchars($service['phone']) ?>" 
                       placeholder="e.g. 080-26701150 or +91 98450 12345 or 112" required>
                <div class="invalid-feedback" id="err_phone"></div>
                <span class="form-help" id="help_phone">Powers the one-tap 'Call' button in the customer mobile app.</span>
            </div>

            <div class="col-6 form-group">
                <label class="form-label" id="lbl_alternate_phone" for="alternate_phone">Alternate Contact Number</label>
                <input type="text" id="alternate_phone" name="alternate_phone" class="form-control" 
                       value="<?= htmlspecialchars($service['alternate_phone'] ?? '') ?>" 
                       placeholder="Optional backup line">
            </div>

            <div class="col-4 form-group">
                <label class="form-label" id="lbl_email" for="email">Official Email Address</label>
                <input type="email" id="email" name="email" class="form-control" 
                       value="<?= htmlspecialchars($service['email'] ?? '') ?>" 
                       placeholder="helpline@department.gov.in">
            </div>

            <div class="col-4 form-group">
                <label class="form-label" id="lbl_website" for="website">Official Portal / Website</label>
                <input type="url" id="website" name="website" class="form-control" 
                       value="<?= htmlspecialchars($service['website'] ?? '') ?>" 
                       placeholder="https://ksp.karnataka.gov.in">
            </div>

            <div class="col-4 form-group">
                <label class="form-label" id="lbl_contact_person" for="contact_person">Contact Person / Desk Designation</label>
                <input type="text" id="contact_person" name="contact_person" class="form-control" 
                       value="<?= htmlspecialchars($service['contact_person'] ?? '') ?>" 
                       placeholder="e.g. Station Duty Officer or Public PRO">
            </div>
        </div>
    </div>

    <!-- SECTION 3: Location & Coordinates -->
    <div class="form-section">
        <div class="form-section-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
            <div>
                <h2 class="form-section-title" id="sec_title_3">3. Location & Coordinates</h2>
                <p class="form-section-desc" id="sec_desc_3">Physical address and geo-coordinates for nearby distance search and interactive routing.</p>
            </div>
            <div id="geoAutoFillBadge" class="geo-autofill-badge" style="display:none;">
                <span class="geo-badge-dot"></span>
                <span id="geoAutoFillText">Auto-filling location from map coordinates...</span>
            </div>
        </div>
        <div class="form-grid">
            <div class="col-8 form-group">
                <label class="form-label required" id="lbl_address_line" for="address_line">Address Line (Street, Door No, Building)</label>
                <input type="text" id="address_line" name="address_line" class="form-control" 
                       value="<?= htmlspecialchars($service['address_line']) ?>" 
                       placeholder="e.g. Fort Road, Near City Market, Kalasipalya" required>
                <div class="invalid-feedback" id="err_address_line"></div>
            </div>

            <div class="col-4 form-group">
                <label class="form-label required" id="lbl_locality" for="locality">Locality / Area</label>
                <input type="text" id="locality" name="locality" class="form-control" 
                       value="<?= htmlspecialchars($service['locality']) ?>" 
                       placeholder="e.g. Kalasipalya or Jayanagar" required>
                <div id="locality_suggestion_box" style="display:none; margin-top:5px; font-size:11.5px; color:#1e40af; background:#eff6ff; border:1px solid #bfdbfe; padding:4px 8px; border-radius:4px;">
                    📍 Map suggestion: <button type="button" id="locality_suggestion_btn" style="background:none; border:none; padding:0; color:#2563eb; font-weight:700; text-decoration:underline; cursor:pointer; font-size:11.5px;"></button> (click to apply)
                </div>
                <div class="invalid-feedback" id="err_locality"></div>
            </div>

            <div class="col-3 form-group">
                <label class="form-label required" id="lbl_state" for="state">State / UT (India)</label>
                <select id="state" name="state" class="form-control" required>
                    <option value="<?= htmlspecialchars($service['state'] ?: 'Karnataka') ?>" selected>
                        <?= htmlspecialchars($service['state'] ?: 'Karnataka') ?>
                    </option>
                </select>
                <div class="invalid-feedback" id="err_state"></div>
            </div>

            <div class="col-3 form-group">
                <label class="form-label required" id="lbl_district" for="district">District</label>
                <select id="district" name="district" class="form-control" required>
                    <option value="<?= htmlspecialchars($service['district']) ?>" selected>
                        <?= htmlspecialchars($service['district']) ?>
                    </option>
                </select>
                <div class="invalid-feedback" id="err_district"></div>
            </div>

            <div class="col-3 form-group">
                <label class="form-label required" id="lbl_city" for="city">City / Town</label>
                <input type="text" id="city" name="city" class="form-control" 
                       value="<?= htmlspecialchars($service['city']) ?>" 
                       placeholder="e.g. Bengaluru" required>
                <div class="invalid-feedback" id="err_city"></div>
            </div>

            <div class="col-3 form-group">
                <label class="form-label" id="lbl_pincode" for="pincode">PIN Code (India)</label>
                <input type="text" id="pincode" name="pincode" class="form-control" 
                       value="<?= htmlspecialchars($service['pincode'] ?? '') ?>" 
                       placeholder="e.g. 560002" maxlength="6" pattern="[0-9]{6}">
            </div>

            <!-- Latitude & Longitude with Interactive India Map Picker -->
            <div class="col-6 form-group">
                <label class="form-label" id="lbl_latitude" for="latitude">Latitude (6° to 37.5° N - India)</label>
                <input type="number" step="any" min="6.0" max="37.5" id="latitude" name="latitude" class="form-control" 
                       value="<?= htmlspecialchars($service['latitude'] ?? '') ?>" 
                       placeholder="e.g. 12.9628000">
                <div class="invalid-feedback" id="err_latitude"></div>
            </div>

            <div class="col-6 form-group">
                <label class="form-label" id="lbl_longitude" for="longitude">Longitude (68° to 97.5° E - India)</label>
                <input type="number" step="any" min="68.0" max="97.5" id="longitude" name="longitude" class="form-control" 
                       value="<?= htmlspecialchars($service['longitude'] ?? '') ?>" 
                       placeholder="e.g. 77.5752000">
                <div class="invalid-feedback" id="err_longitude"></div>
            </div>

            <div class="col-12">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-top:8px;">
                    <div>
                        <span style="font-weight:600; font-size:12.5px; color:#1e293b;" id="map_picker_title">
                            🗺️ Interactive India Map Picker
                        </span>
                        <div style="font-size:11.5px; color:#64748b;" id="map_picker_sub">
                            Click anywhere across India or drag marker to set coordinates. Map boundary is locked to India.
                        </div>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                        <button type="button" id="btnFitFullIndia" class="btn btn-secondary btn-sm" onclick="fitPickerMapToIndia()" style="display:inline-flex; align-items:center; gap:6px; font-weight:600; font-size:12px; padding:6px 12px;" title="Zoom out to view entire India">
                            🇮🇳 View Full India
                        </button>
                        <button type="button" id="btnAutoDetectLocation" class="btn btn-secondary btn-sm" onclick="triggerManualAutoFill()" style="display:inline-flex; align-items:center; gap:6px; font-weight:600; font-size:12px; padding:6px 14px; border-color:#2563eb; color:#2563eb; background:#eff6ff;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            <span>Auto-fill City, District & State</span>
                        </button>
                    </div>
                </div>
                <div id="formMapPicker" class="leaflet-form-picker" style="margin-top:8px;"></div>
            </div>
        </div>
    </div>

    <!-- SECTION 4: Availability & Working Hours -->
    <div class="form-section">
        <div class="form-section-header">
            <h2 class="form-section-title" id="sec_title_4">4. Availability & Working Hours</h2>
            <p class="form-section-desc" id="sec_desc_4">Specify regular opening hours, 24/7 emergency service, or operating schedule.</p>
        </div>
        <div class="form-grid">
            <div class="col-12" style="margin-bottom:8px;">
                <label class="custom-switch">
                    <input type="checkbox" id="is_24_hours" name="is_24_hours" class="switch-input" <?= ($service['is_24_hours'] == 1) ? 'checked' : '' ?>>
                    <span class="switch-slider"></span>
                    <span style="font-weight:600; font-size:13.5px; color:#0f172a;" id="lbl_is_24_hours">24-Hour Continuous Service (Emergency / Trauma / Patrol)</span>
                </label>
            </div>

            <div class="col-4 form-group" id="openTimeGroup">
                <label class="form-label" id="lbl_opening_time" for="opening_time">Opening Time</label>
                <input type="time" id="opening_time" name="opening_time" class="form-control" 
                       value="<?= htmlspecialchars($service['opening_time'] ?? '') ?>" <?= ($service['is_24_hours'] == 1) ? 'disabled' : '' ?>>
            </div>

            <div class="col-4 form-group" id="closeTimeGroup">
                <label class="form-label" id="lbl_closing_time" for="closing_time">Closing Time</label>
                <input type="time" id="closing_time" name="closing_time" class="form-control" 
                       value="<?= htmlspecialchars($service['closing_time'] ?? '') ?>" <?= ($service['is_24_hours'] == 1) ? 'disabled' : '' ?>>
            </div>

            <div class="col-4 form-group">
                <label class="form-label" id="lbl_working_days" for="working_days">Working Days</label>
                <input type="text" id="working_days" name="working_days" class="form-control" 
                       value="<?= htmlspecialchars($service['working_days'] ?? 'Mon - Sat') ?>" 
                       placeholder="e.g. Mon - Sat or Mon - Sun or Not provided">
            </div>

            <div class="col-12 form-group">
                <label class="form-label" id="lbl_availability_notes" for="availability_notes">Availability Notes (Optional)</label>
                <input type="text" id="availability_notes" name="availability_notes" class="form-control" 
                       value="<?= htmlspecialchars($service['availability_notes'] ?? '') ?>" 
                       placeholder="e.g. Doctor on call on Sundays; OPD closed on public holidays.">
            </div>
        </div>
    </div>

    <!-- SECTION 5: Public Information & Facilities -->
    <div class="form-section">
        <div class="form-section-header">
            <h2 class="form-section-title" id="sec_title_5">5. Public Information & Facilities</h2>
            <p class="form-section-desc" id="sec_desc_5">Citizen-facing facilities, amenities, and accessibility notes.</p>
        </div>
        <div class="form-grid">
            <div class="col-12 form-group">
                <label class="form-label" id="lbl_facilities" for="facilities">Facilities / Amenities Offered</label>
                <textarea id="facilities" name="facilities" class="form-control" rows="2" 
                          placeholder="e.g. Wheelchair Ramp, Free Blood Bank, Trauma Care, 24/7 Pharmacy, Parking"><?= htmlspecialchars($service['facilities'] ?? '') ?></textarea>
                <span class="form-help" id="help_facilities">Comma-separated key facilities to help citizens understand services on site.</span>
            </div>

            <div class="col-6 form-group">
                <label class="form-label" id="lbl_accessibility_notes" for="accessibility_notes">Accessibility Information</label>
                <input type="text" id="accessibility_notes" name="accessibility_notes" class="form-control" 
                       value="<?= htmlspecialchars($service['accessibility_notes'] ?? '') ?>" 
                       placeholder="e.g. Wheelchair ramp at main entrance; elevator in Block B.">
            </div>

            <div class="col-6 form-group">
                <label class="form-label" id="lbl_public_notes" for="public_notes">Public Instructions / Special Guidelines</label>
                <input type="text" id="public_notes" name="public_notes" class="form-control" 
                       value="<?= htmlspecialchars($service['public_notes'] ?? '') ?>" 
                       placeholder="e.g. Bring government ID for free consultation.">
            </div>
        </div>
    </div>

    <!-- Form Action Buttons -->
    <div style="display:flex; align-items:center; justify-content:flex-end; gap:12px; margin-top:24px; padding:12px 0 24px 0;">
        <a href="services.php" class="btn btn-secondary" id="btnCancel">Cancel</a>
        <button type="button" class="btn btn-secondary" id="btnDraft" onclick="submitServiceForm('Draft')" style="font-weight:600; padding:10px 22px;">
            Save Draft
        </button>
        <button type="button" class="btn btn-primary" id="btnPublish" onclick="submitServiceForm('Published')" style="font-weight:600; padding:10px 26px;">
            Publish
        </button>
    </div>
</form>

<script>
    const INITIAL_LAT = <?= !empty($service['latitude']) ? (float)$service['latitude'] : 12.9716 ?>;
    const INITIAL_LNG = <?= !empty($service['longitude']) ? (float)$service['longitude'] : 77.5946 ?>;
    const HAS_INITIAL_COORDS = <?= (!empty($service['latitude']) && !empty($service['longitude'])) ? 'true' : 'false' ?>;
    const INITIAL_STATE = <?= json_encode($service['state'] ?: 'Karnataka') ?>;
    const INITIAL_DISTRICT = <?= json_encode($service['district'] ?: 'Bengaluru Urban') ?>;
    const INITIAL_CITY = <?= json_encode($service['city'] ?: 'Bengaluru') ?>;
</script>
<script src="assets/js/india-locations.js?v=<?= time() ?>"></script>
<script src="assets/js/india-mask.js?v=<?= time() ?>"></script>
<script src="assets/js/form.js?v=<?= time() ?>"></script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
