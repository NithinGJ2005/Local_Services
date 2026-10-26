<?php
/**
 * Aguntaka Pahachana Kendra - Layout Footer
 */
?>
    </div> <!-- End .content-area -->
</main> <!-- End .app-main -->
</div> <!-- End .app-wrapper -->

<!-- Toast Notification Container -->
<div class="toast-container" id="toastContainer"></div>

<!-- Generic Confirmation / Action Modal -->
<div class="modal-backdrop" id="genericModal">
    <div class="modal-box" id="genericModalBox">
        <div class="modal-header">
            <h3 class="modal-title" id="genericModalTitle">Action</h3>
            <button class="modal-close-btn" onclick="closeModal('genericModal')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="modal-body" id="genericModalBody">
            <!-- Modal Body Content -->
        </div>
        <div class="modal-footer" id="genericModalFooter">
            <button class="btn btn-secondary" onclick="closeModal('genericModal')">Cancel</button>
            <button class="btn btn-primary" id="genericModalSubmitBtn">Confirm</button>
        </div>
    </div>
</div>

<!-- Customer App Service Preview Modal -->
<div class="modal-backdrop" id="previewModal">
    <div class="modal-box modal-box-lg" style="max-width: 650px;">
        <div class="modal-header">
            <div style="display:flex; align-items:center; gap:8px;">
                <h3 class="modal-title">Customer App Preview</h3>
                <span class="category-tag" id="previewCategoryBadge">Category</span>
            </div>
            <button class="modal-close-btn" onclick="closeModal('previewModal')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="modal-body" style="background:#f1f5f9; padding:24px 20px;">
            <div class="preview-card" id="previewPhoneCard">
                <div class="preview-phone-header">
                    <div style="width:36px; height:36px; border-radius:50%; background:#2563eb; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:bold;" id="previewInitialIcon">
                        🏥
                    </div>
                    <div>
                        <h4 style="color:#ffffff; font-size:15px; margin:0;" id="previewServiceName">Service Name</h4>
                        <span style="color:#93c5fd; font-size:11px;" id="previewLocality">Locality, City</span>
                    </div>
                </div>
                <div class="preview-phone-body">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <span class="badge-status status-Published" id="previewStatusBadge">Published</span>
                        <span style="font-size:11.5px; color:#64748b; font-weight:600;" id="previewHoursBadge">Open Today</span>
                    </div>

                    <p style="font-size:13px; color:#334155; margin-bottom:14px; line-height:1.4;" id="previewDescription">
                        Detailed service description will appear here.
                    </p>

                    <!-- Customer Action Buttons -->
                    <div class="preview-action-row">
                        <a href="javascript:void(0)" class="preview-action-btn" id="previewCallBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>Call</span>
                        </a>
                        <a href="javascript:void(0)" class="preview-action-btn" id="previewDirectionsBtn" target="_blank">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                            </svg>
                            <span>Directions</span>
                        </a>
                        <a href="javascript:void(0)" class="preview-action-btn" id="previewInfoBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <span>Info</span>
                        </a>
                    </div>

                    <!-- Details Sections -->
                    <div class="preview-info-box">
                        <div class="preview-info-title">Address & Location</div>
                        <div style="font-size:12.5px; color:#1e293b;" id="previewFullAddress">Full address details</div>
                    </div>

                    <div class="preview-info-box">
                        <div class="preview-info-title">Facilities & Amenities</div>
                        <div style="font-size:12.5px; color:#1e293b;" id="previewFacilities">Wheelchair Access, Emergency Desk</div>
                    </div>

                    <div class="preview-info-box" id="previewAccessibilityBox">
                        <div class="preview-info-title">Accessibility & Public Notes</div>
                        <div style="font-size:12.5px; color:#1e293b;" id="previewAccessibilityNotes">Public instructions or accessibility guidance</div>
                    </div>

                    <div style="padding:10px; border-radius:6px; background:#eff6ff; border:1px dashed #93c5fd; font-size:11px; color:#1e40af; text-align:center;">
                        🔒 Staff Note: Customer app view strictly filters out internal review notes and audit credentials.
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal('previewModal')">Close Preview</button>
            <a href="#" class="btn btn-primary" id="previewEditBtn">Edit Listing</a>
        </div>
    </div>
</div>

<!-- Core Leaflet Map Script CDN -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<!-- Main Dashboard UI Scripts -->
<script src="assets/js/main.js"></script>
</body>
</html>
