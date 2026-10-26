/**
 * Aguntaka Pahachana Kendra - Manage Local Services Table Controller
 * Pure Vanilla JavaScript
 */

// Standalone safe HTML escape utility (self-contained, zero external dependency)
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Fallback for showToast if called prior to main.js execution
if (typeof window.showToast !== 'function') {
    window.showToast = function(msg, type) {
        console.log(`[${type || 'info'}] ${msg}`);
    };
}

let currentPage = 1;
const pageLimit = 500; // Load all service listings on one continuous page (single page display)
let searchTimeout = null;
let pendingActionData = null;

// Global helper to filter by category from table badges or cards
window.selectCategoryFilter = function(categoryName) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = categoryName;
        // Case-insensitive fallback if exact match wasn't selected
        if (!categoryFilter.value && categoryName) {
            for (let i = 0; i < categoryFilter.options.length; i++) {
                if (categoryFilter.options[i].value.toLowerCase() === categoryName.toLowerCase()) {
                    categoryFilter.selectedIndex = i;
                    break;
                }
            }
        }
        currentPage = 1;
        if (typeof syncUrlParams === 'function') syncUrlParams();
        if (typeof updateActiveFilterVisuals === 'function') updateActiveFilterVisuals();
        fetchServices();
    }
};

let syncUrlParams = function() {};
let updateActiveFilterVisuals = function() {};

document.addEventListener('DOMContentLoaded', () => {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const districtFilter = document.getElementById('districtFilter');
    const coordsFilter = document.getElementById('coordsFilter');
    const searchInput = document.getElementById('searchInput');

    // Parse URL search parameters (e.g. from dashboard cards or direct links)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('status') && statusFilter && urlParams.get('status')) {
        statusFilter.value = urlParams.get('status').trim();
    }
    if (urlParams.has('category') && categoryFilter && urlParams.get('category')) {
        const catParam = urlParams.get('category').trim();
        categoryFilter.value = catParam;
        // Case-insensitive fallback match
        if (!categoryFilter.value && catParam) {
            for (let i = 0; i < categoryFilter.options.length; i++) {
                const opt = categoryFilter.options[i];
                if (opt.value.toLowerCase() === catParam.toLowerCase() || opt.text.toLowerCase() === catParam.toLowerCase()) {
                    categoryFilter.selectedIndex = i;
                    break;
                }
            }
        }
    }
    if (urlParams.has('district') && districtFilter && urlParams.get('district')) {
        districtFilter.value = urlParams.get('district').trim();
    }
    if (urlParams.has('has_coords') && coordsFilter && urlParams.get('has_coords') !== null) {
        coordsFilter.value = urlParams.get('has_coords').trim();
    }
    if (urlParams.has('search') && searchInput && urlParams.get('search')) {
        searchInput.value = urlParams.get('search').trim();
    }

    // Sync active filters to URL search parameters without full page reload
    syncUrlParams = function() {
        try {
            const url = new URL(window.location.href);
            if (categoryFilter && categoryFilter.value) {
                url.searchParams.set('category', categoryFilter.value);
            } else {
                url.searchParams.delete('category');
            }
            if (statusFilter && statusFilter.value) {
                url.searchParams.set('status', statusFilter.value);
            } else {
                url.searchParams.delete('status');
            }
            if (districtFilter && districtFilter.value) {
                url.searchParams.set('district', districtFilter.value);
            } else {
                url.searchParams.delete('district');
            }
            if (coordsFilter && coordsFilter.value !== '') {
                url.searchParams.set('has_coords', coordsFilter.value);
            } else {
                url.searchParams.delete('has_coords');
            }
            if (searchInput && searchInput.value.trim()) {
                url.searchParams.set('search', searchInput.value.trim());
            } else {
                url.searchParams.delete('search');
            }
            window.history.replaceState({}, '', url.toString());
        } catch (e) {
            console.warn('URL sync notice:', e);
        }
    };

    // Visual active filter tags and subtle blue highlights
    updateActiveFilterVisuals = function() {
        const filters = [
            { el: categoryFilter, label: 'Category' },
            { el: statusFilter, label: 'Status' },
            { el: districtFilter, label: 'District' },
            { el: coordsFilter, label: 'Coordinates' }
        ];

        const activeBadges = [];

        filters.forEach(f => {
            if (!f.el) return;
            if (f.el.value !== '') {
                f.el.classList.add('filter-active-highlight');
                activeBadges.push({
                    label: f.label,
                    val: f.el.options[f.el.selectedIndex] ? f.el.options[f.el.selectedIndex].text : f.el.value,
                    key: f.el.id
                });
            } else {
                f.el.classList.remove('filter-active-highlight');
            }
        });

        const badgeContainer = document.getElementById('activeFilterBadgeContainer');
        if (badgeContainer) {
            if (activeBadges.length > 0) {
                badgeContainer.style.display = 'flex';
                badgeContainer.innerHTML = `
                    <span style="font-size:12px; font-weight:600; color:#64748b;">Active Filters:</span>
                    ${activeBadges.map(b => `
                        <span style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; font-size:12px; font-weight:600; padding:3px 10px; border-radius:99px;">
                            ${escapeHtml(b.label)}: <strong>${escapeHtml(b.val)}</strong>
                            <span onclick="clearSingleFilter('${b.key}')" style="cursor:pointer; font-size:14px; line-height:1; color:#2563eb; font-weight:700;" title="Clear this filter">&times;</span>
                        </span>
                    `).join('')}
                    <button type="button" onclick="document.getElementById('resetFiltersBtn').click()" style="background:none; border:none; color:#dc2626; font-size:12px; font-weight:600; cursor:pointer; margin-left:4px; text-decoration:underline;">
                        Clear All
                    </button>
                `;
            } else {
                badgeContainer.style.display = 'none';
                badgeContainer.innerHTML = '';
            }
        }
    };

    window.clearSingleFilter = function(filterId) {
        const el = document.getElementById(filterId);
        if (el) {
            el.value = '';
            currentPage = 1;
            syncUrlParams();
            updateActiveFilterVisuals();
            fetchServices();
        }
    };

    // Initialize visual state
    updateActiveFilterVisuals();

    // Trigger initial fetch
    fetchServices();

    const resetBtn = document.getElementById('resetFiltersBtn');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentPage = 1;
                syncUrlParams();
                fetchServices();
            }, 300);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => { 
            currentPage = 1; 
            syncUrlParams();
            updateActiveFilterVisuals(); 
            fetchServices(); 
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', () => { 
            currentPage = 1; 
            syncUrlParams();
            updateActiveFilterVisuals(); 
            fetchServices(); 
        });
    }

    if (districtFilter) {
        districtFilter.addEventListener('change', () => { 
            currentPage = 1; 
            syncUrlParams();
            updateActiveFilterVisuals(); 
            fetchServices(); 
        });
    }

    if (coordsFilter) {
        coordsFilter.addEventListener('change', () => { 
            currentPage = 1; 
            syncUrlParams();
            updateActiveFilterVisuals(); 
            fetchServices(); 
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            if (districtFilter) districtFilter.value = '';
            if (coordsFilter) coordsFilter.value = '';
            currentPage = 1;
            syncUrlParams();
            updateActiveFilterVisuals();
            fetchServices();
        });
    }

    // Pagination buttons
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchServices();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentPage++;
            fetchServices();
        });
    }

    // Status action confirmation button
    const confirmBtn = document.getElementById('confirmStatusActionBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', executeStatusAction);
    }

    // Delete listing confirmation button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', executeDeleteService);
    }
});

async function fetchServices() {
    const tableBody = document.getElementById('servicesTableBody');
    const loadingState = document.getElementById('tableLoadingState');
    const emptyState = document.getElementById('tableEmptyState');
    const tableRecordSummary = document.getElementById('tableRecordSummary');
    
    if (loadingState) loadingState.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    if (tableBody) tableBody.innerHTML = '';

    const search = document.getElementById('searchInput')?.value.trim() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const district = document.getElementById('districtFilter')?.value || '';
    const coords = document.getElementById('coordsFilter')?.value || '';

    const params = new URLSearchParams({
        page: currentPage,
        limit: pageLimit,
        search: search,
        category: category,
        status: status,
        district: district,
        has_coords: coords
    });

    try {
        const response = await fetch(`api/services.php?${params.toString()}`);
        const result = await response.json();

        if (loadingState) loadingState.style.display = 'none';

        if (!result.success || !result.data || result.data.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (tableRecordSummary) {
                tableRecordSummary.textContent = category 
                    ? `0 listings found in category "${category}"`
                    : '0 listings found matching active criteria';
            }
            updatePagination(0, 1, 1);
            return;
        }

        const items = result.data;
        const total = result.pagination.total;
        const totalPages = result.pagination.total_pages;

        if (tableRecordSummary) {
            tableRecordSummary.textContent = category 
                ? `Showing ${items.length} of ${total} listings in "${category}"`
                : `Showing ${items.length} of ${total} total service listings`;
        }

        updatePagination(total, currentPage, totalPages);

        // Render rows
        items.forEach(svc => {
            const tr = document.createElement('tr');
            const safeServiceName = escapeHtml(svc.service_name || '').replace(/'/g, "\\'");
            const isSupervisor = (typeof CURRENT_USER_ROLE !== 'undefined' && (CURRENT_USER_ROLE === 'supervisor' || CURRENT_USER_ROLE === 'admin'));
            
            const hasCoords = (svc.latitude && svc.longitude);
            const coordsBadge = hasCoords 
                ? `<span style="display:inline-flex; align-items:center; gap:4px; font-size:11px; color:#059669; font-weight:600;"><span style="width:6px;height:6px;background:#10b981;border-radius:50%;"></span>${parseFloat(svc.latitude).toFixed(3)}, ${parseFloat(svc.longitude).toFixed(3)}</span>`
                : `<span style="display:inline-flex; align-items:center; gap:4px; font-size:11px; color:#d97706; font-weight:600;"><span style="width:6px;height:6px;background:#f59e0b;border-radius:50%;"></span>Location not set</span>`;

            // Action Buttons (View, Edit, Delete, Supervisor Publish/Unpublish)
            let actionsHtml = `
                <div class="action-buttons-group" style="justify-content: flex-end;">
                    <a href="service-view.php?id=${svc.id}" class="btn-icon" title="View Full Details">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </a>
                    <a href="service-form.php?id=${svc.id}" class="btn-icon" title="Edit Service">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </a>
                    <button class="btn-icon btn-icon-danger" title="Delete Service" onclick="confirmDeleteService(${svc.id}, '${safeServiceName}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
            `;

            // Supervisor Workflow Actions (Publish / Unpublish)
            if (isSupervisor) {
                if (svc.status === 'Published') {
                    actionsHtml += `
                        <button class="btn-icon" title="Unpublish (Move to Draft)" onclick="promptStatusAction(${svc.id}, '${safeServiceName}', 'Draft', 'unpublish')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                            </svg>
                        </button>
                    `;
                } else if (svc.status === 'Draft') {
                    actionsHtml += `
                        <button class="btn-icon" title="Publish Listing" onclick="promptStatusAction(${svc.id}, '${safeServiceName}', 'Published', 'publish')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#059669">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </button>
                    `;
                }
            }

            actionsHtml += `</div>`;

            tr.innerHTML = `
                <td>
                    <span class="table-service-name">${escapeHtml(svc.service_name)}</span>
                    <span class="table-subtext">ID: #${svc.id}</span>
                </td>
                <td>
                    <span class="category-tag" style="cursor:pointer;" onclick="selectCategoryFilter('${escapeHtml(svc.category)}')" title="Click to filter by ${escapeHtml(svc.category)}">${escapeHtml(svc.category)}</span>
                </td>
                <td>
                    <span>${escapeHtml(svc.locality)}</span>
                </td>
                <td>
                    <span>${escapeHtml(svc.city)}</span>
                    <span class="table-subtext">${escapeHtml(svc.district)}</span>
                </td>
                <td>
                    <span style="font-family:monospace; font-size:12.5px;">${escapeHtml(svc.phone)}</span>
                </td>
                <td>
                    <span class="badge-status status-${escapeHtml(svc.status.replace(/\s+/g, '_'))}">${escapeHtml(svc.status)}</span>
                </td>
                <td>
                    ${coordsBadge}
                </td>
                <td>
                    <span style="font-size:11.5px; color:#64748b;">${formatDate(svc.updated_at)}</span>
                </td>
                <td style="text-align:right;">
                    ${actionsHtml}
                </td>
            `;

            tableBody.appendChild(tr);
        });

    } catch (err) {
        if (loadingState) loadingState.style.display = 'none';
        showToast('Failed to load local services: ' + err.message, 'error');
    }
}

function updatePagination(total, page, totalPages) {
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationControls = document.getElementById('paginationControls');

    if (pageIndicator) pageIndicator.textContent = page;
    if (prevBtn) prevBtn.disabled = (page <= 1);
    if (nextBtn) nextBtn.disabled = (page >= totalPages || totalPages === 0);

    if (paginationInfo) {
        paginationInfo.innerHTML = `Showing all <strong>${total}</strong> service listings on this page`;
    }

    if (paginationControls) {
        paginationControls.style.display = (totalPages <= 1) ? 'none' : 'flex';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/**
 * Prompt Status Action Confirmation Modal
 */
function promptStatusAction(serviceId, serviceName, targetStatus, actionType) {
    pendingActionData = {
        serviceId: serviceId,
        serviceName: serviceName,
        targetStatus: targetStatus,
        actionType: actionType
    };

    const titleEl = document.getElementById('statusActionModalTitle');
    const descEl = document.getElementById('statusActionModalDesc');

    if (actionType === 'unpublish') {
        titleEl.textContent = 'Unpublish Local Service';
        descEl.textContent = `Are you sure you want to unpublish "${serviceName}"? It will be moved to Draft status and hidden from the Aguntaka citizen mobile app.`;
    } else if (actionType === 'publish') {
        titleEl.textContent = 'Publish Service to Live App';
        descEl.textContent = `Confirm publication of "${serviceName}"? This service will be immediately visible to all citizens in nearby search and maps.`;
    } else {
        titleEl.textContent = `Change Status to ${targetStatus}`;
        descEl.textContent = `Confirm updating status for "${serviceName}" to ${targetStatus}?`;
    }

    openModal('statusActionModal');
}

/**
 * Execute the confirmed status change
 */
async function executeStatusAction() {
    if (!pendingActionData) return;

    try {
        const payload = {
            id: pendingActionData.serviceId,
            status: pendingActionData.targetStatus,
            action: pendingActionData.actionType
        };

        const response = await fetch(`api/services.php?id=${pendingActionData.serviceId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        closeModal('statusActionModal');

        if (result.success) {
            showToast(result.message || 'Status successfully updated', 'success');
            fetchServices();
        } else {
            showToast(result.message || 'Unable to update status', 'error');
        }
    } catch (err) {
        showToast('Error during status update: ' + err.message, 'error');
    }
}

/**
 * Prompt Delete Service Confirmation Modal
 */
let pendingDeleteId = null;

window.confirmDeleteService = function(id, serviceName) {
    pendingDeleteId = id;
    const nameEl = document.getElementById('deleteServiceName');
    if (nameEl) {
        nameEl.textContent = serviceName ? `"${serviceName}"` : `Listing #${id}`;
    }
    openModal('deleteServiceModal');
};

/**
 * Execute Service Deletion
 */
async function executeDeleteService() {
    if (!pendingDeleteId) return;

    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Deleting...';
    }

    try {
        const response = await fetch(`api/services.php?id=${pendingDeleteId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        closeModal('deleteServiceModal');

        if (result.success) {
            showToast(result.message || 'Service deleted successfully', 'success');
            fetchServices();
        } else {
            showToast(result.message || 'Unable to delete service listing', 'error');
        }
    } catch (err) {
        closeModal('deleteServiceModal');
        showToast('Error deleting service: ' + err.message, 'error');
    } finally {
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Delete Service';
        }
        pendingDeleteId = null;
    }
}

