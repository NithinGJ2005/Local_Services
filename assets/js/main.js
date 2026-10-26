/**
 * Aguntaka Pahachana Kendra - Main UI & Utility Script
 * Pure Vanilla JavaScript (Zero Node.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Sidebar Toggle
    const mobileBtn = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('appSidebar');

    if (mobileBtn && sidebar) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('sidebar-open');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && sidebar.classList.contains('sidebar-open')) {
                if (!sidebar.contains(e.target) && e.target !== mobileBtn) {
                    sidebar.classList.remove('sidebar-open');
                }
            }
        });
    }

    // 2. Desktop Sidebar Minimize / Expand Toggle
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    if (collapseBtn) {
        const isCollapsed = document.documentElement.classList.contains('sidebar-collapsed') || document.body.classList.contains('sidebar-collapsed');
        if (isCollapsed) {
            document.documentElement.classList.add('sidebar-collapsed');
            document.body.classList.add('sidebar-collapsed');
            collapseBtn.setAttribute('title', 'Expand sidebar menu');
            collapseBtn.setAttribute('aria-label', 'Expand sidebar menu');
        } else {
            collapseBtn.setAttribute('title', 'Minimize sidebar menu');
            collapseBtn.setAttribute('aria-label', 'Minimize sidebar menu');
        }

        collapseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const nowCollapsed = document.documentElement.classList.toggle('sidebar-collapsed');
            document.body.classList.toggle('sidebar-collapsed', nowCollapsed);
            localStorage.setItem('sidebar_minimized', nowCollapsed ? 'true' : 'false');
            collapseBtn.setAttribute('title', nowCollapsed ? 'Expand sidebar menu' : 'Minimize sidebar menu');
            collapseBtn.setAttribute('aria-label', nowCollapsed ? 'Expand sidebar menu' : 'Minimize sidebar menu');

            // Trigger window resize event so Leaflet maps automatically resize smoothly
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 280);
        });
    }
});

/**
 * Toast Notifications
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Clear any prior toasts to prevent stacking multiple banners
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else if (type === 'warning') {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(15px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Modal Handlers
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Close modal if user clicks on backdrop
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('show');
        document.body.style.overflow = '';
    }
});

/**
 * Escape HTML utility
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Open Customer App Preview Modal for a given service ID
 */
async function openServicePreview(serviceId) {
    try {
        const response = await fetch(`api/services.php?id=${serviceId}`);
        const result = await response.json();

        if (!result.success || !result.data) {
            showToast(result.message || 'Unable to load service preview', 'error');
            return;
        }

        const data = result.data;
        document.getElementById('previewServiceName').textContent = data.service_name;
        document.getElementById('previewLocality').textContent = `${data.locality}, ${data.city}`;
        document.getElementById('previewCategoryBadge').textContent = data.category;
        
        const statusBadge = document.getElementById('previewStatusBadge');
        statusBadge.className = `badge-status status-${data.status.replace(/\s+/g, '_')}`;
        statusBadge.textContent = data.status;

        const hoursText = data.is_24_hours == 1 
            ? 'Open 24 Hours' 
            : (data.opening_time && data.closing_time ? `${data.opening_time.substring(0,5)} - ${data.closing_time.substring(0,5)} (${data.working_days || 'Mon-Sat'})` : (data.working_days || 'Hours not specified'));
        document.getElementById('previewHoursBadge').textContent = hoursText;

        document.getElementById('previewDescription').textContent = data.description || data.short_description || 'No detailed description provided.';
        
        // Actions
        const callBtn = document.getElementById('previewCallBtn');
        callBtn.href = `tel:${data.phone}`;

        const dirBtn = document.getElementById('previewDirectionsBtn');
        if (data.latitude && data.longitude) {
            dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`;
            dirBtn.style.opacity = '1';
            dirBtn.style.pointerEvents = 'auto';
        } else {
            const query = encodeURIComponent(`${data.service_name}, ${data.locality}, ${data.city}`);
            dirBtn.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
            dirBtn.style.opacity = '1';
            dirBtn.style.pointerEvents = 'auto';
        }

        const fullAddr = `${data.address_line}, ${data.locality}, ${data.city}, ${data.district}, ${data.state || 'Karnataka'} - ${data.pincode || ''}`;
        document.getElementById('previewFullAddress').textContent = fullAddr;

        document.getElementById('previewFacilities').textContent = data.facilities || 'General public service facilities available.';

        const notesBox = document.getElementById('previewAccessibilityBox');
        if (data.accessibility_notes || data.public_notes) {
            notesBox.style.display = 'block';
            document.getElementById('previewAccessibilityNotes').textContent = 
                `${data.accessibility_notes || ''} ${data.public_notes ? '• ' + data.public_notes : ''}`.trim();
        } else {
            notesBox.style.display = 'none';
        }

        const editBtn = document.getElementById('previewEditBtn');
        if (editBtn) {
            editBtn.href = `service-form.php?id=${data.id}`;
        }

        openModal('previewModal');
    } catch (err) {
        showToast('Error loading service preview: ' + err.message, 'error');
    }
}
