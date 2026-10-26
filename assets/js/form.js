/**
 * Aguntaka Pahachana Kendra - Add / Edit Form Controller
 * Pure Vanilla JavaScript
 */

let pickerMap = null;
let pickerMarker = null;
let duplicateDebounce = null;
let reverseGeocodeDebounce = null;
let lastGeocodedLat = null;
let lastGeocodedLng = null;
let isMapInteracted = false;

// India Geographic Bounding Box
const INDIA_BOUNDS = {
    minLat: 6.0,
    maxLat: 37.5,
    minLng: 68.0,
    maxLng: 97.5
};

function distToSegmentSquared(p, v, w) {
    const l2 = (v[0] - w[0])**2 + (v[1] - w[1])**2;
    if (l2 === 0) return (p[0] - v[0])**2 + (p[1] - v[1])**2;
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return (p[0] - (v[0] + t * (w[0] - v[0])))**2 + (p[1] - (v[1] + t * (w[1] - v[1])))**2;
}

/**
 * Strict India Boundary & Perimeter Verification
 * Ensures service listings are strictly located within India
 */
function isCoordWithinIndia(lat, lng) {
    if (isNaN(lat) || isNaN(lng)) return false;
    // 1. National bounding box check
    if (lat < INDIA_BOUNDS.minLat || lat > INDIA_BOUNDS.maxLat ||
        lng < INDIA_BOUNDS.minLng || lng > INDIA_BOUNDS.maxLng) {
        return false;
    }

    // 2. Island territories (Lakshadweep & Andaman & Nicobar)
    if (lat >= 8.0 && lat <= 12.5 && lng >= 71.5 && lng <= 74.2) return true; // Lakshadweep
    if (lat >= 6.5 && lat <= 14.0 && lng >= 92.0 && lng <= 94.5) return true; // Andaman & Nicobar

    // 3. Ray casting on India's perimeter polygon with coastal buffer
    if (typeof INDIA_POLYGON_COORDS !== 'undefined' && Array.isArray(INDIA_POLYGON_COORDS) && INDIA_POLYGON_COORDS.length > 10) {
        const vs = INDIA_POLYGON_COORDS;
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            const xi = vs[i][0], yi = vs[i][1];
            const xj = vs[j][0], yj = vs[j][1];
            const intersect = ((yi > lng) !== (yj > lng)) &&
                (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        if (inside) return true;

        // Coastal tolerance buffer: allow up to ~12km around coastline
        const toleranceSq = 0.12 * 0.12;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            if (distToSegmentSquared([lat, lng], vs[i], vs[j]) <= toleranceSq) {
                return true;
            }
        }
        return false;
    }

    return true;
}

let lastOutsideToastTime = 0;
/**
 * Simple, clean feedback when staff points or drags outside India
 */
function notifyOutsideIndia() {
    const now = Date.now();
    if (now - lastOutsideToastTime < 2000) return; // Debounce: prevents stacking duplicate toasts
    lastOutsideToastTime = now;
    if (typeof showToast === 'function') {
        showToast('⚠️ Service is only for India 🇮🇳', 'warning');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize State & District Dropdowns from India Location Data
    if (typeof populateStateDropdown === 'function') {
        const initialState = (typeof INITIAL_STATE !== 'undefined' && INITIAL_STATE) ? INITIAL_STATE : 'Karnataka';
        const initialDistrict = (typeof INITIAL_DISTRICT !== 'undefined' && INITIAL_DISTRICT) ? INITIAL_DISTRICT : 'Bengaluru Urban';
        populateStateDropdown('state', initialState);
        updateDistrictDropdown('state', 'district', initialDistrict);

        const stateSelect = document.getElementById('state');
        if (stateSelect) {
            stateSelect.addEventListener('change', () => {
                updateDistrictDropdown('state', 'district');
            });
        }
    }

    // 1. Initialize Leaflet Map Picker
    initMapPicker();

    // 2. 24-Hours Toggle Handler
    const switch24 = document.getElementById('is_24_hours');
    const openTime = document.getElementById('opening_time');
    const closeTime = document.getElementById('closing_time');

    if (switch24) {
        switch24.addEventListener('change', () => {
            const is24 = switch24.checked;
            if (openTime) openTime.disabled = is24;
            if (closeTime) closeTime.disabled = is24;
            if (is24) {
                if (openTime) openTime.value = '';
                if (closeTime) closeTime.value = '';
            }
        });
    }

    // 3. Duplicate Detection on Name & Address typing
    const nameInput = document.getElementById('service_name');
    const addrInput = document.getElementById('address_line');

    if (nameInput) nameInput.addEventListener('input', triggerDuplicateCheck);
    if (addrInput) addrInput.addEventListener('input', triggerDuplicateCheck);

    // Locality map suggestion click handler
    const locSuggestionBtn = document.getElementById('locality_suggestion_btn');
    const locSuggestionBox = document.getElementById('locality_suggestion_box');
    const locField = document.getElementById('locality');
    if (locSuggestionBtn && locField && locSuggestionBox) {
        locSuggestionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            locField.value = locSuggestionBtn.textContent.trim();
            locSuggestionBox.style.display = 'none';
            locField.classList.remove('is-invalid');
            const errLoc = document.getElementById('err_locality');
            if (errLoc) errLoc.textContent = '';
            locField.focus();
        });
    }

    // 4. Coordinates input manual change updates map marker (Restricted to India)
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');

    if (latInput && lngInput) {
        const syncCoords = () => {
            const lat = parseFloat(latInput.value);
            const lng = parseFloat(lngInput.value);
            if (!isNaN(lat) && !isNaN(lng)) {
                if (isCoordWithinIndia(lat, lng)) {
                    latInput.classList.remove('is-invalid');
                    lngInput.classList.remove('is-invalid');
                    const errLat = document.getElementById('err_latitude');
                    const errLng = document.getElementById('err_longitude');
                    if (errLat) errLat.textContent = '';
                    if (errLng) errLng.textContent = '';
                    const alertEl = document.getElementById('mapOutsideIndiaAlert');
                    if (alertEl) alertEl.style.display = 'none';
                    if (pickerMarker && pickerMap) {
                        isMapInteracted = true;
                        pointLocation(lat, lng, true, false);
                    }
                } else {
                    latInput.classList.add('is-invalid');
                    lngInput.classList.add('is-invalid');
                    const errLat = document.getElementById('err_latitude');
                    const errLng = document.getElementById('err_longitude');
                    if (errLat) errLat.textContent = '⚠️ Service is exclusively for India (Latitude 6° to 37.5° N).';
                    if (errLng) errLng.textContent = '⚠️ Service is exclusively for India (Longitude 68° to 97.5° E).';
                    notifyOutsideIndia(lat, lng);
                }
            }
        };
        latInput.addEventListener('input', syncCoords);
        lngInput.addEventListener('input', syncCoords);
    }

    // 5. Category "Other" toggle handler
    const categorySelect = document.getElementById('category');
    const customWrapper = document.getElementById('customCategoryWrapper');
    const customInput = document.getElementById('custom_category');

    if (categorySelect && customWrapper) {
        categorySelect.addEventListener('change', () => {
            if (categorySelect.value === 'Other') {
                customWrapper.style.display = 'block';
                if (customInput) {
                    customInput.focus();
                }
            } else {
                customWrapper.style.display = 'none';
                if (customInput) {
                    customInput.value = '';
                    customInput.classList.remove('is-invalid');
                }
                const errCustom = document.getElementById('err_custom_category');
                if (errCustom) errCustom.textContent = '';
            }
        });
    }

    if (customInput) {
        customInput.addEventListener('input', () => {
            customInput.classList.remove('is-invalid');
            const errCustom = document.getElementById('err_custom_category');
            if (errCustom) errCustom.textContent = '';
        });
    }

    // 6. Initialize Bi-directional Language Switcher & Translator
    initLanguageSwitcher();

    // 7. Initialize File Upload Dropzone
    initFileDropzone();
});

/**
 * Custom High-Resolution Precision Map Pin
 */
function createCustomPinIcon() {
    return L.divIcon({
        className: 'custom-map-pin',
        html: `
            <div class="pin-marker-wrapper">
                <div class="pin-pulse-ring"></div>
                <svg class="pin-marker-svg" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 0C8.05887 0 0 8.05887 0 18C0 30.5 18 44 18 44C18 44 36 30.5 36 18C36 8.05887 27.9411 0 18 0Z" fill="#2563eb" stroke="#ffffff" stroke-width="2.5"/>
                    <circle cx="18" cy="18" r="6.5" fill="#ffffff"/>
                    <circle cx="18" cy="18" r="3" fill="#2563eb"/>
                </svg>
            </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [0, 0],
        tooltipAnchor: [0, -44]
    });
}

const INDIA_BOUNDS_FIT = [[6.5, 68.0], [37.5, 97.5]];
const INDIA_MAX_BOUNDS_FIT = [[1.5, 58.0], [42.0, 107.0]];

/**
 * Initialize Interactive "Pick on Map" Control with Silk-Smooth Zooming
 */
function initMapPicker() {
    const mapContainer = document.getElementById('formMapPicker');
    if (!mapContainer) return;

    // Smooth Fractional Zoom & Kinetic Scrolling Options
    pickerMap = L.map('formMapPicker', {
        zoomSnap: 0.25,           // Fractional zoom: allows micro-zoom levels
        zoomDelta: 0.5,           // Smooth wheel / +/- button increments
        wheelPxPerZoomLevel: 100, // Silky smooth mouse wheel scaling
        wheelDebounceTime: 30,    // Responsive mousewheel response
        zoomAnimation: true,
        zoomAnimationThreshold: 4,
        fadeAnimation: true,
        markerZoomAnimation: true,
        inertia: true,
        inertiaDeceleration: 3000,
        easeLinearity: 0.2,
        maxBounds: INDIA_MAX_BOUNDS_FIT,
        maxBoundsViscosity: 0.5,
        minZoom: 3.5
    });

    // Initially keep map zoomed in on the center (not whole India)
    pickerMap.setView([INITIAL_LAT, INITIAL_LNG], HAS_INITIAL_COORDS ? 13 : 11);

    // High performance buffered tile layer strictly bounded to India
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 3.5,
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        keepBuffer: 6,
        updateWhenZooming: false,
        updateWhenIdle: true
    }).addTo(pickerMap);

    // Apply Solid Inverted Mask: clean, natural background outside India without harsh blue lines
    if (typeof applyIndiaMapMask === 'function') {
        applyIndiaMapMask(pickerMap);
    }

    // Add draggable custom pin marker
    pickerMarker = L.marker([INITIAL_LAT, INITIAL_LNG], {
        draggable: true,
        icon: createCustomPinIcon()
    }).addTo(pickerMap);

    // Pin dragging feedback with outside-India rejection
    pickerMarker.on('dragend', () => {
        const pos = pickerMarker.getLatLng();
        if (!isCoordWithinIndia(pos.lat, pos.lng)) {
            notifyOutsideIndia(pos.lat, pos.lng);
            // Revert marker to previous valid coordinate
            const curLat = parseFloat(document.getElementById('latitude')?.value);
            const curLng = parseFloat(document.getElementById('longitude')?.value);
            if (isCoordWithinIndia(curLat, curLng)) {
                pickerMarker.setLatLng([curLat, curLng]);
            } else {
                pickerMarker.setLatLng([INITIAL_LAT, INITIAL_LNG]);
            }
            return;
        }
        pointLocation(pos.lat, pos.lng, false, false, null, true);
    });

    // Clicking anywhere on the map smoothly moves and points the pin
    pickerMap.on('click', (e) => {
        if (!isCoordWithinIndia(e.latlng.lat, e.latlng.lng)) {
            notifyOutsideIndia(e.latlng.lat, e.latlng.lng);
            return;
        }
        pointLocation(e.latlng.lat, e.latlng.lng, true, false, null, true);
    });

    if (HAS_INITIAL_COORDS) {
        // Initial load: don't overwrite saved fields
        pointLocation(INITIAL_LAT, INITIAL_LNG, false, false, null, false);
    }
}

/**
 * Quick Action: Zoom out to view entire India in picker
 */
window.fitPickerMapToIndia = function() {
    if (pickerMap) {
        pickerMap.fitBounds(INDIA_BOUNDS_FIT, { padding: [15, 15], animate: true, duration: 0.7 });
    }
};

/**
 * Precision Pointing Handler
 */
function pointLocation(lat, lng, panToPoint = true, flyToPoint = false, targetZoom = null, autoGeocode = true) {
    if (!pickerMarker || !pickerMap) return;

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    // Strict boundary enforcement: verify coordinate lies inside India
    if (!isCoordWithinIndia(parsedLat, parsedLng)) {
        notifyOutsideIndia();
        // Snap marker back to current valid inputs if any
        const curLat = parseFloat(document.getElementById('latitude')?.value);
        const curLng = parseFloat(document.getElementById('longitude')?.value);
        if (isCoordWithinIndia(curLat, curLng)) {
            pickerMarker.setLatLng([curLat, curLng]);
        } else {
            pickerMarker.setLatLng([INITIAL_LAT, INITIAL_LNG]);
        }
        return false;
    }

    const formattedLat = parsedLat.toFixed(7);
    const formattedLng = parsedLng.toFixed(7);

    // Update marker location
    pickerMarker.setLatLng([parsedLat, parsedLng]);

    // Bind and open clean tooltip indicator
    pickerMarker.unbindTooltip();
    pickerMarker.bindTooltip(`📍 Pointed (India): ${parsedLat.toFixed(5)}, ${parsedLng.toFixed(5)}`, {
        permanent: false,
        direction: 'top',
        className: 'coords-live-badge'
    }).openTooltip();

    // Smooth movement
    if (flyToPoint) {
        pickerMap.flyTo([lat, lng], targetZoom || 15, { duration: 0.9, easeLinearity: 0.25 });
    } else if (panToPoint) {
        pickerMap.panTo([lat, lng], { animate: true, duration: 0.35 });
    }

    setCoordinates(parseFloat(formattedLat), parseFloat(formattedLng), autoGeocode);
}

function setCoordinates(lat, lng, autoGeocode = true) {
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');

    if (latInput && lngInput) {
        latInput.value = lat.toFixed(7);
        lngInput.value = lng.toFixed(7);

        // Flash visual highlight for confirmation
        latInput.classList.add('input-coord-highlight');
        lngInput.classList.add('input-coord-highlight');
        setTimeout(() => {
            latInput.classList.remove('input-coord-highlight');
            lngInput.classList.remove('input-coord-highlight');
        }, 1200);

        if (autoGeocode) {
            triggerReverseGeocode(lat, lng, false);
        }
    }
}

/**
 * Explicit Button Trigger for Auto-Fill
 */
function triggerManualAutoFill() {
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');
    if (!latInput || !lngInput) return;

    const lat = parseFloat(latInput.value);
    const lng = parseFloat(lngInput.value);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        if (typeof showToast === 'function') {
            showToast('Please click a location on the map or enter valid coordinates first.', 'error');
        } else {
            alert('Please click a location on the map or enter valid coordinates first.');
        }
        return;
    }

    triggerReverseGeocode(lat, lng, true);
}

/**
 * Auto-fill State, District and City/Town from Coordinates
 */
function triggerReverseGeocode(lat, lng, isImmediate = false) {
    if (!isCoordWithinIndia(lat, lng)) {
        showGeoAutoFillBadge('error', 'Coordinates outside India (Must be 6°N–37.5°N, 68°E–97.5°E)', 3000);
        return;
    }

    // Skip redundant calls if coordinates haven't changed noticeably (~5 meters) unless immediate click
    if (!isImmediate && lastGeocodedLat !== null && lastGeocodedLng !== null) {
        const dLat = Math.abs(lat - lastGeocodedLat);
        const dLng = Math.abs(lng - lastGeocodedLng);
        if (dLat < 0.00005 && dLng < 0.00005) {
            return;
        }
    }

    clearTimeout(reverseGeocodeDebounce);
    showGeoAutoFillBadge('loading', 'Detecting State, District & City...');

    const executeGeocode = async () => {
        try {
            lastGeocodedLat = lat;
            lastGeocodedLng = lng;

            // 1. Try local server-side reverse geocoding API
            let data = null;

            try {
                const res = await fetch(`api/reverse_geocode.php?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`);
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.success && json.data) {
                        data = json.data;
                    }
                }
            } catch (err) {
                console.warn('Local geocode proxy failed, falling back to direct OSM:', err);
            }

            // 2. Fallback directly to OpenStreetMap Nominatim restricted to India
            if (!data) {
                try {
                    const directRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&countrycodes=in`);
                    if (directRes.ok) {
                        const directJson = await directRes.json();
                        if (directJson && directJson.address) {
                            const a = directJson.address;
                            const countryCode = (a.country_code || '').toLowerCase();
                            if (countryCode && countryCode !== 'in') {
                                showGeoAutoFillBadge('error', 'Location is outside India.', 3000);
                                return;
                            }
                            data = {
                                state: a.state || '',
                                district: a.state_district || a.county || '',
                                county: a.county || '',
                                city: a.city || a.town || a.village || a.suburb || a.county || '',
                                pincode: a.postcode || '',
                                locality: a.suburb || a.neighbourhood || a.quarter || a.village || a.hamlet || a.residential || ''
                            };
                        }
                    }
                } catch (fallbackErr) {
                    console.warn('Direct OSM lookup failed:', fallbackErr);
                }
            }

            if (!data) {
                showGeoAutoFillBadge('error', 'Location lookup unavailable for coordinates', 3000);
                return;
            }

            // 3. Match State and District using India Location Data
            const rawState = data.state || '';
            const rawDistrict = data.district || data.state_district || '';
            const rawCounty = data.county || '';
            const rawCity = data.city || data.town || data.village || data.municipality || data.suburb || '';
            const rawPincode = data.pincode || '';
            const rawLocality = data.locality || '';

            const stateSelect = document.getElementById('state');
            const districtSelect = document.getElementById('district');
            const cityInput = document.getElementById('city');
            const pincodeInput = document.getElementById('pincode');
            const localityInput = document.getElementById('locality');

            // Resolve best matching State
            const matchedState = (typeof findBestStateMatch === 'function') 
                ? findBestStateMatch(rawState) 
                : (rawState || 'Karnataka');

            if (stateSelect) {
                let stateFound = false;
                for (let i = 0; i < stateSelect.options.length; i++) {
                    if (stateSelect.options[i].value.toLowerCase() === matchedState.toLowerCase()) {
                        stateSelect.selectedIndex = i;
                        stateFound = true;
                        break;
                    }
                }
                if (!stateFound && matchedState) {
                    const opt = document.createElement('option');
                    opt.value = matchedState;
                    opt.textContent = matchedState;
                    opt.selected = true;
                    stateSelect.appendChild(opt);
                }
            }

            // Resolve best matching District within the State
            const matchedDistrict = (typeof findBestDistrictMatch === 'function')
                ? findBestDistrictMatch(matchedState, rawDistrict, rawCounty, rawCity)
                : (rawDistrict || '');

            // Update district dropdown options for the matched state and select matched district
            if (typeof updateDistrictDropdown === 'function') {
                updateDistrictDropdown('state', 'district', matchedDistrict);
            }

            // Set City / Town
            if (cityInput && rawCity) {
                const cleanCity = rawCity.replace(/\s+(taluk|taluku|mandal|tehsil|corporation|municipality)\b/gi, '').trim();
                cityInput.value = cleanCity || rawCity;
            }

            // Auto-fill PIN Code if currently empty or previously auto-filled
            if (pincodeInput && rawPincode) {
                if (!pincodeInput.value.trim() || pincodeInput.dataset.autoFilled === 'true') {
                    pincodeInput.value = rawPincode;
                    pincodeInput.dataset.autoFilled = 'true';
                }
            }

            // Locality is filled manually, but offer map-detected suggestion if available
            const suggestionBox = document.getElementById('locality_suggestion_box');
            const suggestionBtn = document.getElementById('locality_suggestion_btn');
            if (suggestionBox && suggestionBtn) {
                if (rawLocality && rawLocality.trim() !== '') {
                    suggestionBtn.textContent = rawLocality.trim();
                    suggestionBox.style.display = 'block';
                } else {
                    suggestionBox.style.display = 'none';
                }
            }

            // Visual feedback: glow effect on updated inputs
            const updatedElements = [cityInput, districtSelect, stateSelect];
            if (rawPincode && pincodeInput) updatedElements.push(pincodeInput);

            updatedElements.forEach(el => {
                if (!el) return;
                el.classList.add('input-autofill-highlight');
                setTimeout(() => el.classList.remove('input-autofill-highlight'), 1800);
            });

            // Display success badge
            const cityName = cityInput?.value || rawCity || '';
            const summaryText = `✓ Auto-filled: ${cityName ? cityName + ', ' : ''}${matchedDistrict} (${matchedState})`;
            showGeoAutoFillBadge('success', summaryText, 4500);

            if (typeof showToast === 'function' && isImmediate) {
                showToast(`Auto-filled: ${cityName ? cityName + ', ' : ''}${matchedDistrict} (${matchedState})`, 'success');
            }

        } catch (err) {
            console.error('Error during reverse geocode auto-fill:', err);
            showGeoAutoFillBadge('error', 'Auto-fill failed to parse coordinates', 3000);
        }
    };

    if (isImmediate) {
        executeGeocode();
    } else {
        reverseGeocodeDebounce = setTimeout(executeGeocode, 400);
    }
}

function showGeoAutoFillBadge(type, message, autoHideMs = null) {
    const badge = document.getElementById('geoAutoFillBadge');
    const textSpan = document.getElementById('geoAutoFillText');
    if (!badge || !textSpan) return;

    badge.className = 'geo-autofill-badge';
    if (type === 'loading') {
        badge.classList.add('loading');
    } else if (type === 'error') {
        badge.classList.add('error');
    }

    textSpan.textContent = message;
    badge.style.display = 'inline-flex';
    badge.style.opacity = '1';

    if (autoHideMs) {
        setTimeout(() => {
            badge.style.opacity = '0';
            setTimeout(() => {
                if (badge.style.opacity === '0') {
                    badge.style.display = 'none';
                }
            }, 300);
        }, autoHideMs);
    }
}

/**
 * Trigger duplicate listing check
 */
function triggerDuplicateCheck() {
    clearTimeout(duplicateDebounce);
    duplicateDebounce = setTimeout(async () => {
        const name = document.getElementById('service_name')?.value.trim() || '';
        const address = document.getElementById('address_line')?.value.trim() || '';
        const excludeId = document.getElementById('serviceId')?.value || '0';
        const warningBox = document.getElementById('duplicateWarningBox');
        const matchesContainer = document.getElementById('duplicateMatchesList');

        if (name.length < 3) {
            if (warningBox) warningBox.style.display = 'none';
            return;
        }

        try {
            const params = new URLSearchParams({
                name: name,
                address: address,
                exclude_id: excludeId
            });

            const res = await fetch(`api/check_duplicate.php?${params.toString()}`);
            const data = await res.json();

            if (data.duplicate && data.matches && data.matches.length > 0) {
                if (warningBox) warningBox.style.display = 'flex';
                if (matchesContainer) {
                    let listHtml = '<ul style="margin:4px 0 0 16px; padding:0;">';
                    data.matches.forEach(m => {
                        listHtml += `<li><strong>${escapeHtml(m.service_name)}</strong> (${escapeHtml(m.category)}) - ${escapeHtml(m.address_line)}, ${escapeHtml(m.city)} [${m.status}]</li>`;
                    });
                    listHtml += '</ul>';
                    matchesContainer.innerHTML = listHtml;
                }
            } else {
                if (warningBox) warningBox.style.display = 'none';
            }
        } catch (err) {
            console.error('Duplicate check error:', err);
        }
    }, 400);
}

/**
 * Client-Side Validation and Submission
 */
async function submitServiceForm(targetStatus) {
    // Clear previous error states
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');

    const serviceId = parseInt(document.getElementById('serviceId')?.value || '0');
    const isEdit = (serviceId > 0);

    const name = document.getElementById('service_name')?.value.trim();
    const category = document.getElementById('category')?.value.trim();
    const customCategory = document.getElementById('custom_category')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const addressLine = document.getElementById('address_line')?.value.trim();
    const locality = document.getElementById('locality')?.value.trim();
    const city = document.getElementById('city')?.value.trim();
    const district = document.getElementById('district')?.value.trim();
    const state = document.getElementById('state')?.value.trim();

    const latStr = document.getElementById('latitude')?.value.trim();
    const lngStr = document.getElementById('longitude')?.value.trim();

    let hasErrors = false;

    if (!name) {
        setError('service_name', 'Service name is required.');
        hasErrors = true;
    }
    if (!category) {
        setError('category', 'Please select a service category.');
        hasErrors = true;
    } else if (category === 'Other') {
        if (!customCategory) {
            setError('custom_category', 'Please specify your service category.');
            hasErrors = true;
        }
    }
    if (!phone) {
        setError('phone', 'Public contact phone number is required.');
        hasErrors = true;
    }
    if (!addressLine) {
        setError('address_line', 'Address line is required.');
        hasErrors = true;
    }
    if (!locality) {
        setError('locality', 'Locality / Area is required.');
        hasErrors = true;
    }
    if (!city) {
        setError('city', 'City / Town is required.');
        hasErrors = true;
    }
    if (!district) {
        setError('district', 'District is required.');
        hasErrors = true;
    }
    if (!state) {
        setError('state', 'State is required.');
        hasErrors = true;
    }

    if (latStr !== '' || lngStr !== '') {
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (isNaN(lat) || isNaN(lng) || !isCoordWithinIndia(lat, lng)) {
            setError('latitude', 'Service is only for India (Latitude 6° to 37.5° N).');
            setError('longitude', 'Service is only for India (Longitude 68° to 97.5° E).');
            notifyOutsideIndia(lat, lng);
            hasErrors = true;
        }
    }

    if (hasErrors) {
        showToast('Please correct highlighted validation errors.', 'error');
        return;
    }

    // Build payload
    const formElement = document.getElementById('serviceForm');
    const formData = new FormData(formElement);
    const payload = {};
    formData.forEach((val, key) => {
        payload[key] = val;
    });

    if (payload['category'] === 'Other') {
        payload['category'] = customCategory;
    }
    delete payload['custom_category'];

    payload['status'] = targetStatus || 'Draft';
    payload['is_24_hours'] = document.getElementById('is_24_hours')?.checked ? 1 : 0;
    if (latStr !== '') payload['latitude'] = parseFloat(latStr);
    if (lngStr !== '') payload['longitude'] = parseFloat(lngStr);

    try {
        const url = isEdit ? `api/services.php?id=${serviceId}` : 'api/services.php';
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            showToast(result.message || 'Service listing saved successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'services.php';
            }, 900);
        } else {
            showToast(result.message || 'Failed to save service listing.', 'error');
        }
    } catch (err) {
        showToast('Network error while saving: ' + err.message, 'error');
    }
}

function setError(fieldId, errorMsg) {
    const inputEl = document.getElementById(fieldId);
    const feedbackEl = document.getElementById(`err_${fieldId}`);
    if (inputEl) inputEl.classList.add('is-invalid');
    if (feedbackEl) feedbackEl.textContent = errorMsg;
}

/**
 * ==========================================================================
 * Bi-directional English <-> Kannada Query & Auto-Translator Controller
 * ==========================================================================
 */
const TRANSLATABLE_FIELDS = [
    'service_name',
    'short_description',
    'description',
    'contact_person',
    'address_line',
    'locality',
    'city',
    'working_days',
    'availability_notes',
    'facilities',
    'accessibility_notes',
    'public_notes',
    'custom_category'
];

const FORM_I18N = {
    en: {
        sections: {
            sec_title_1: '1. Basic Information',
            sec_desc_1: 'Primary name and classification displayed prominently in the customer application.',
            sec_title_2: '2. Contact Information',
            sec_desc_2: 'Public communication channels for citizen inquiries and emergency calls.',
            sec_title_3: '3. Location & Coordinates',
            sec_desc_3: 'Physical address and geo-coordinates for nearby distance search and interactive routing.',
            sec_title_4: '4. Availability & Working Hours',
            sec_desc_4: 'Specify regular opening hours, 24/7 emergency service, or operating schedule.',
            sec_title_5: '5. Public Information & Facilities',
            sec_desc_5: 'Citizen-facing facilities, amenities, and accessibility notes.'
        },
        labels: {
            lbl_service_name: 'Official Service Name',
            lbl_category: 'Service Category',
            lbl_custom_category: 'Specify Service Category',
            lbl_short_description: 'Short Summary (1-2 sentences)',
            lbl_description: 'Full Description / Services Offered',
            lbl_image_url: 'Service File / Image / Document (Optional)',
            lbl_phone: 'Public Contact Number (Primary Phone)',
            lbl_alternate_phone: 'Alternate Contact Number',
            lbl_email: 'Official Email Address',
            lbl_website: 'Official Portal / Website',
            lbl_contact_person: 'Contact Person / Desk Designation',
            lbl_country: 'Country',
            lbl_address_line: 'Address Line (Street, Door No, Building)',
            lbl_locality: 'Locality / Area',
            lbl_city: 'City / Town',
            lbl_district: 'District',
            lbl_state: 'State / UT (India)',
            lbl_pincode: 'PIN Code (India)',
            lbl_latitude: 'Latitude (6° to 37.5° N - India)',
            lbl_longitude: 'Longitude (68° to 97.5° E - India)',
            lbl_is_24_hours: '24-Hour Continuous Service (Emergency / Trauma / Patrol)',
            lbl_opening_time: 'Opening Time',
            lbl_closing_time: 'Closing Time',
            lbl_working_days: 'Working Days',
            lbl_availability_notes: 'Availability Notes (Optional)',
            lbl_facilities: 'Facilities / Amenities Offered',
            lbl_accessibility_notes: 'Accessibility Information',
            lbl_public_notes: 'Public Instructions / Special Guidelines'
        },
        placeholders: {
            service_name: 'e.g. Victoria Hospital Government Healthcare Center',
            custom_category: 'Type your service category...',
            short_description: 'e.g. Tertiary government hospital with emergency trauma care.',
            description: 'Detailed information visible when customer opens the service card...',
            image_url: 'https://example.gov.in/images/hospital_facade.jpg',
            phone: 'e.g. 080-26701150 or +91 98450 12345 or 112',
            alternate_phone: 'Optional backup line',
            email: 'helpline@department.gov.in',
            website: 'https://ksp.karnataka.gov.in',
            contact_person: 'e.g. Station Duty Officer or Public PRO',
            address_line: 'e.g. Fort Road, Near City Market, Kalasipalya',
            locality: 'e.g. Kalasipalya or Jayanagar',
            working_days: 'e.g. Mon - Sat or Mon - Sun or Not provided',
            availability_notes: 'e.g. Doctor on call on Sundays; OPD closed on public holidays.',
            facilities: 'e.g. Wheelchair Ramp, Free Blood Bank, Trauma Care, 24/7 Pharmacy, Parking',
            accessibility_notes: 'e.g. Wheelchair ramp at main entrance; elevator in Block B.',
            public_notes: 'e.g. Bring government ID for free consultation.'
        },
        help: {
            help_phone: "Powers the one-tap 'Call' button in the customer mobile app.",
            help_facilities: 'Comma-separated key facilities to help citizens understand services on site.',
            map_picker_title: '🗺️ Interactive India Map Picker',
            map_picker_sub: 'Click anywhere across India or drag marker to set coordinates. Map boundary is locked to India.'
        },
        buttons: {
            btnCancel: 'Cancel',
            btnDraft: 'Save Draft',
            btnPublish: 'Publish'
        },
        selectOptions: {
            opt_category_default: 'Select Category...',
            opt_category_other: 'Other'
        }
    },
    kn: {
        sections: {
            sec_title_1: '1. ಮೂಲ ಮಾಹಿತಿ (Basic Information)',
            sec_desc_1: 'ಗ್ರಾಹಕರ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಪ್ರಮುಖವಾಗಿ ಪ್ರದರ್ಶಿಸಲಾಗುವ ಪ್ರಾಥಮಿಕ ಹೆಸರು ಮತ್ತು ವರ್ಗೀಕರಣ.',
            sec_title_2: '2. ಸಂಪರ್ಕ ಮಾಹಿತಿ (Contact Information)',
            sec_desc_2: 'ನಾಗರಿಕರ ವಿಚಾರಣೆ ಮತ್ತು ತುರ್ತು ಕರೆಗಳಿಗಾಗಿ ಸಾರ್ವಜನಿಕ ಸಂಪರ್ಕ ಮಾರ್ಗಗಳು.',
            sec_title_3: '3. ಸ್ಥಳ ಮತ್ತು ನಿರ್ದೇಶಾಂಕಗಳು (Location & Coordinates)',
            sec_desc_3: 'ಹತ್ತಿರದ ದೂರ ಹುಡುಕಾಟ ಮತ್ತು ಮಾರ್ಗ ನಕ್ಷೆಗಾಗಿ ಭೌತಿಕ ವಿಳಾಸ ಮತ್ತು ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳು.',
            sec_title_4: '4. ಲಭ್ಯತೆ ಮತ್ತು ಕೆಲಸದ ಸಮಯ (Availability & Hours)',
            sec_desc_4: 'ನಿಯಮಿತ ತೆರೆಯುವ ಸಮಯ, 24/7 ತುರ್ತು ಸೇವೆ ಅಥವಾ ಕಾರ್ಯಾಚರಣೆಯ ವೇಳಾಪಟ್ಟಿಯನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸಿ.',
            sec_title_5: '5. ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿ ಮತ್ತು ಸೌಲಭ್ಯಗಳು (Public Info & Facilities)',
            sec_desc_5: 'ನಾಗರಿಕ ಸೌಲಭ್ಯಗಳು, ಸೌಕರ್ಯಗಳು ಮತ್ತು ಪ್ರವೇಶಸಾಧ್ಯತೆಯ ಟಿಪ್ಪಣಿಗಳು.'
        },
        labels: {
            lbl_service_name: 'ಅಧಿಕೃತ ಸೇವೆಯ ಹೆಸರು (Official Service Name)',
            lbl_category: 'ಸೇವಾ ವರ್ಗ (Service Category)',
            lbl_custom_category: 'ಸೇವಾ ವರ್ಗವನ್ನು ನಮೂದಿಸಿ (Specify Category)',
            lbl_short_description: 'ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ (Short Summary - 1-2 ವಾಕ್ಯಗಳು)',
            lbl_description: 'ಸಂಪೂರ್ಣ ವಿವರ / ಲಭ್ಯವಿರುವ ಸೇವೆಗಳು (Full Description)',
            lbl_image_url: 'ಸೇವಾ ಕಡತ / ಚಿತ್ರ / ದಾಖಲೆ (ಐಚ್ಛಿಕ)',
            lbl_phone: 'ಸಾರ್ವಜನಿಕ ಸಂಪರ್ಕ ಸಂಖ್ಯೆ - ಮುಖ್ಯ ಫೋನ್ (Primary Phone)',
            lbl_alternate_phone: 'ಪರ್ಯಾಯ ಸಂಪರ್ಕ ಸಂಖ್ಯೆ (Alternate Phone)',
            lbl_email: 'ಅಧಿಕೃತ ಇಮೇಲ್ ವಿಳಾಸ (Official Email)',
            lbl_website: 'ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ (Official Website)',
            lbl_contact_person: 'ಸಂಪರ್ಕ ಅಧಿಕಾರಿ / ಹುದ್ದೆ (Contact Person)',
            lbl_country: 'ದೇಶ (ಭಾರತ)',
            lbl_address_line: 'ವಿಳಾಸ - ರಸ್ತೆ, ಮನೆ/ಕಟ್ಟಡ ಸಂಖ್ಯೆ (Address Line)',
            lbl_locality: 'ಬಡಾವಣೆ / ಪ್ರದೇಶ (Locality / Area)',
            lbl_city: 'ನಗರ / ಪಟ್ಟಣ (City / Town)',
            lbl_district: 'ಜಿಲ್ಲೆ (District)',
            lbl_state: 'ರಾಜ್ಯ / ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ (ಭಾರತ)',
            lbl_pincode: 'ಪಿನ್ ಕೋಡ್ (ಭಾರತ)',
            lbl_latitude: 'ಅಕ್ಷಾಂಶ (6° ನಿಂದ 37.5° N - ಭಾರತ)',
            lbl_longitude: 'ರೇಖಾಂಶ (68° ನಿಂದ 97.5° E - ಭಾರತ)',
            lbl_is_24_hours: '24 ಗಂಟೆಗಳ ನಿರಂತರ ಸೇವೆ (ತುರ್ತು / ಟ್ರಾಮಾ / ಗಸ್ತು)',
            lbl_opening_time: 'ತೆರೆಯುವ ಸಮಯ (Opening Time)',
            lbl_closing_time: 'ಮುಚ್ಚುವ ಸಮಯ (Closing Time)',
            lbl_working_days: 'ಕೆಲಸದ ದಿನಗಳು (Working Days)',
            lbl_availability_notes: 'ಲಭ್ಯತೆ ಟಿಪ್ಪಣಿಗಳು - ಐಚ್ಛಿಕ (Availability Notes)',
            lbl_facilities: 'ಲಭ್ಯವಿರುವ ಸೌಲಭ್ಯಗಳು (Facilities Offered)',
            lbl_accessibility_notes: 'ಪ್ರವೇಶಸಾಧ್ಯತೆ ಮಾಹಿತಿ (Accessibility Info)',
            lbl_public_notes: 'ಸಾರ್ವಜನಿಕ ಸೂಚನೆಗಳು / ವಿಶೇಷ ಮಾರ್ಗಸೂಚಿಗಳು'
        },
        placeholders: {
            service_name: 'ಉದಾ: ವಿಕ್ಟೋರಿಯಾ ಆಸ್ಪತ್ರೆ ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಕೇಂದ್ರ',
            custom_category: 'ನಿಮ್ಮ ಸೇವಾ ವರ್ಗವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
            short_description: 'ಉದಾ: ತುರ್ತು ಟ್ರಾಮಾ ಆರೈಕೆಯೊಂದಿಗೆ ಉನ್ನತ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ.',
            description: 'ಗ್ರಾಹಕರು ಸೇವಾ ವಿವರವನ್ನು ತೆರೆದಾಗ ಕಾಣಿಸುವ ವಿವರವಾದ ಮಾಹಿತಿ...',
            image_url: 'https://example.gov.in/images/hospital_facade.jpg',
            phone: 'ಉದಾ: 080-26701150 ಅಥವಾ +91 98450 12345 ಅಥವಾ 112',
            alternate_phone: 'ಐಚ್ಛಿಕ ಪರ್ಯಾಯ ಸಂಖ್ಯೆ',
            email: 'helpline@department.gov.in',
            website: 'https://ksp.karnataka.gov.in',
            contact_person: 'ಉದಾ: ಠಾಣಾ ಕರ್ತವ್ಯ ಅಧಿಕಾರಿ ಅಥವಾ ಸಾರ್ವಜನಿಕ ಸಂಪರ್ಕಾಧಿಕಾರಿ',
            address_line: 'ಉದಾ: ಕೋಟೆ ರಸ್ತೆ, ಸಿಟಿ ಮಾರ್ಕೆಟ್ ಹತ್ತಿರ, ಕಲಾಸಿಪಾಳ್ಯ',
            locality: 'ಉದಾ: ಕಲಾಸಿಪಾಳ್ಯ ಅಥವಾ ಜಯನಗರ',
            working_days: 'ಉದಾ: ಸೋಮ - ಶನಿ ಅಥವಾ ಸೋಮ - ಭಾನು',
            availability_notes: 'ಉದಾ: ಭಾನುವಾರ ವೈದ್ಯರು ಕರೆಯ ಮೇರೆಗೆ ಲಭ್ಯ; ಸಾರ್ವಜನಿಕ ರಜಾದಿನಗಳಲ್ಲಿ ಒಪಿಡಿ ಇರುವುದಿಲ್ಲ.',
            facilities: 'ಉದಾ: ಗಾಲಿಕುರ್ಚಿ ಇಳಿಜಾರು, ಉಚಿತ ರಕ್ತ ನಿಧಿ, ತುರ್ತು ಆರೈಕೆ, 24/7 ಔಷಧಾಲಯ, ಪಾರ್ಕಿಂಗ್',
            accessibility_notes: 'ಉದಾ: ಮುಖ್ಯ ದ್ವಾರದಲ್ಲಿ ಗಾಲಿಕುರ್ಚಿ ರಾಂಪ್; ಬಿ ಬ್ಲಾಕ್‌ನಲ್ಲಿ ಲಿಫ್ಟ್ ಲಭ್ಯವಿದೆ.',
            public_notes: 'ಉದಾ: ಉಚಿತ ತಪಾಸಣೆಗಾಗಿ ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿಯನ್ನು ತನ್ನಿ.'
        },
        help: {
            help_phone: "ಗ್ರಾಹಕರ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ 'ಕರೆ' ಬಟನ್‌ಗೆ ಈ ಸಂಖ್ಯೆಯನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.",
            help_facilities: 'ಸಾರ್ವಜನಿಕರಿಗೆ ಸ್ಥಳದಲ್ಲಿರುವ ಸೇವೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಅಲ್ಪವಿರಾಮದಿಂದ ಪ್ರತ್ಯೇಕಿಸಲಾದ ಸೌಲಭ್ಯಗಳು.',
            map_picker_title: '🗺️ ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ ನಿಯಂತ್ರಣ (Pick on Map)',
            map_picker_sub: 'ನಿಖರವಾದ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಹೊಂದಿಸಲು ನಕ್ಷೆಯಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಮಾರ್ಕರ್ ಎಳೆಯಿರಿ.'
        },
        buttons: {
            btnCancel: 'ರದ್ದುಮಾಡಿ',
            btnDraft: 'ಡ್ರಾಫ್ಟ್ ಆಗಿ ಉಳಿಸಿ',
            btnPublish: 'ಪ್ರಕಟಿಸಿ'
        },
        selectOptions: {
            opt_category_default: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ...',
            opt_category_other: 'ಇತರೆ (Other)'
        }
    }
};

let activeLanguage = 'en';
let isTranslating = false;

function isKannadaText(str) {
    return /[\u0C80-\u0CFF]/.test(str);
}

function initLanguageSwitcher() {
    const btnEn = document.getElementById('langBtnEn');
    const btnKn = document.getElementById('langBtnKn');
    const btnSwap = document.getElementById('langSwapBtn');

    if (!btnEn || !btnKn || !btnSwap) return;

    // Detect initial dominant language from existing values
    let knCount = 0;
    let enCount = 0;
    TRANSLATABLE_FIELDS.forEach(id => {
        const val = document.getElementById(id)?.value.trim() || '';
        if (val) {
            if (isKannadaText(val)) knCount++;
            else if (/[a-zA-Z]/.test(val)) enCount++;
        }
    });

    const initialLang = (knCount > enCount) ? 'kn' : 'en';
    applyFormQueryLanguage(initialLang);

    // Switch to English
    btnEn.addEventListener('click', () => {
        if (activeLanguage !== 'en') {
            switchLanguage('en');
        }
    });

    // Switch to Kannada
    btnKn.addEventListener('click', () => {
        if (activeLanguage !== 'kn') {
            switchLanguage('kn');
        }
    });

    // Swap button (⇄)
    btnSwap.addEventListener('click', () => {
        const nextLang = (activeLanguage === 'en') ? 'kn' : 'en';
        switchLanguage(nextLang);
    });
}

function applyFormQueryLanguage(lang) {
    activeLanguage = lang;
    const dict = FORM_I18N[lang];
    if (!dict) return;

    // Update active pill UI
    const btnEn = document.getElementById('langBtnEn');
    const btnKn = document.getElementById('langBtnKn');
    if (btnEn && btnKn) {
        if (lang === 'en') {
            btnEn.classList.add('active');
            btnKn.classList.remove('active');
        } else {
            btnKn.classList.add('active');
            btnEn.classList.remove('active');
        }
    }

    // Section headers and descriptions
    for (const [id, text] of Object.entries(dict.sections)) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // Field labels (queries)
    for (const [id, text] of Object.entries(dict.labels)) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // Placeholders
    for (const [id, text] of Object.entries(dict.placeholders)) {
        const el = document.getElementById(id);
        if (el) el.placeholder = text;
    }

    // Help texts
    for (const [id, text] of Object.entries(dict.help)) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // Action buttons
    for (const [id, text] of Object.entries(dict.buttons)) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // Select options
    for (const [id, text] of Object.entries(dict.selectOptions)) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
}

async function switchLanguage(targetLang) {
    if (isTranslating) return;

    // 1. Instantly switch all field questions/queries and UI elements
    applyFormQueryLanguage(targetLang);

    // 2. Check if there are any entered field values to translate
    const payloadFields = {};
    let hasContent = false;

    TRANSLATABLE_FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const val = el.value.trim();
            if (val) {
                payloadFields[id] = val;
                hasContent = true;
            }
        }
    });

    if (!hasContent) {
        return;
    }

    // 3. Fast auto-translate entered field values silently
    const btnSwap = document.getElementById('langSwapBtn');
    const sourceLang = (targetLang === 'kn') ? 'en' : 'kn';

    try {
        isTranslating = true;
        if (btnSwap) {
            btnSwap.disabled = true;
            btnSwap.style.opacity = '0.6';
        }

        const response = await fetch('api/translate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: payloadFields,
                source: sourceLang,
                target: targetLang
            })
        });

        const result = await response.json();

        if (result.success && result.translations) {
            for (const [fieldId, translatedText] of Object.entries(result.translations)) {
                const el = document.getElementById(fieldId);
                if (el && translatedText) {
                    el.value = translatedText;
                    el.classList.add('field-translated-highlight');
                    setTimeout(() => el.classList.remove('field-translated-highlight'), 1200);
                }
            }
        }
    } catch (err) {
        console.error('Translation error:', err);
    } finally {
        isTranslating = false;
        if (btnSwap) {
            btnSwap.disabled = false;
            btnSwap.style.opacity = '1';
        }
    }
}

/**
 * ==========================================================================
 * File Upload, Drag-and-Drop, and Attachment Controller
 * ==========================================================================
 */
function initFileDropzone() {
    const dropzone = document.getElementById('fileDropzone');
    const fileInput = document.getElementById('serviceFileInput');
    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('drag-over');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            fileInput.files = files;
            handleFileUpload(fileInput);
        }
    });
}

function handleFileUpload(input) {
    const file = input.files && input.files[0];
    if (!file) return;

    const progressContainer = document.getElementById('uploadProgressContainer');
    const progressBar = document.getElementById('uploadProgressBar');
    const progressText = document.getElementById('uploadProgressText');
    const dropzonePrompt = document.getElementById('dropzonePrompt');
    const dropzoneAttached = document.getElementById('dropzoneAttached');
    const attachedThumb = document.getElementById('attachedThumb');
    const attachedFileName = document.getElementById('attachedFileName');
    const attachedFileStatus = document.getElementById('attachedFileStatus');
    const fileUrlInput = document.getElementById('file_url');
    const fileNameInput = document.getElementById('file_name');
    const fileTypeInput = document.getElementById('file_type');
    const imageUrlInput = document.getElementById('image_url');

    if (progressContainer) progressContainer.style.display = 'block';
    if (progressBar) progressBar.style.width = '15%';
    if (progressText) progressText.textContent = `Uploading ${file.name}...`;

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/upload_file.php', true);

    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            if (progressBar) progressBar.style.width = percent + '%';
            if (progressText) progressText.textContent = `Uploading ${file.name} (${percent}%)...`;
        }
    };

    xhr.onload = function() {
        if (progressContainer) progressContainer.style.display = 'none';

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const res = JSON.parse(xhr.responseText);
                if (res.success && res.file_url) {
                    if (fileUrlInput) fileUrlInput.value = res.file_url;
                    if (fileNameInput) fileNameInput.value = res.file_name || file.name;
                    if (fileTypeInput) fileTypeInput.value = file.type || '';
                    if (imageUrlInput) imageUrlInput.value = res.file_url;
                    if (attachedFileName) attachedFileName.textContent = res.file_name || file.name;
                    if (attachedFileStatus) attachedFileStatus.textContent = '✓ File uploaded and attached';

                    if (attachedThumb) {
                        if (res.is_image) {
                            attachedThumb.innerHTML = `<img src="${res.file_url}" alt="Preview" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">`;
                        } else {
                            const ext = file.name.split('.').pop().toLowerCase();
                            let icon = '📄';
                            if (ext === 'pdf') icon = '📕';
                            else if (['doc', 'docx'].includes(ext)) icon = '📘';
                            else if (['xls', 'xlsx'].includes(ext)) icon = '📗';
                            attachedThumb.innerHTML = `<span style="font-size:22px;">${icon}</span>`;
                        }
                    }

                    if (dropzonePrompt) dropzonePrompt.style.display = 'none';
                    if (dropzoneAttached) dropzoneAttached.style.display = 'flex';
                    showToast('File uploaded successfully!', 'success');
                } else {
                    showToast(res.message || 'File upload failed.', 'error');
                }
            } catch (e) {
                showToast('Invalid server response during upload.', 'error');
            }
        } else {
            showToast('Server returned error during upload: ' + xhr.status, 'error');
        }
    };

    xhr.onerror = function() {
        if (progressContainer) progressContainer.style.display = 'none';
        showToast('Network error during file upload.', 'error');
    };

    xhr.send(formData);
}

function removeAttachedFile() {
    const fileUrlInput = document.getElementById('file_url');
    const fileNameInput = document.getElementById('file_name');
    const fileTypeInput = document.getElementById('file_type');
    const imageUrlInput = document.getElementById('image_url');
    const fileInput = document.getElementById('serviceFileInput');
    const dropzonePrompt = document.getElementById('dropzonePrompt');
    const dropzoneAttached = document.getElementById('dropzoneAttached');
    const attachedThumb = document.getElementById('attachedThumb');
    const attachedFileName = document.getElementById('attachedFileName');
    const attachedFileStatus = document.getElementById('attachedFileStatus');

    if (fileUrlInput) fileUrlInput.value = '';
    if (fileNameInput) fileNameInput.value = '';
    if (fileTypeInput) fileTypeInput.value = '';
    if (imageUrlInput) imageUrlInput.value = '';
    if (fileInput) fileInput.value = '';
    if (attachedThumb) attachedThumb.innerHTML = '';
    if (attachedFileName) attachedFileName.textContent = '';
    if (attachedFileStatus) attachedFileStatus.textContent = '';
    if (dropzoneAttached) dropzoneAttached.style.display = 'none';
    if (dropzonePrompt) dropzonePrompt.style.display = 'block';
}




