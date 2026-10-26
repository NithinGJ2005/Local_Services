# Aguntaka Pahachana Kendra - Local Services Staff Dashboard

> **Standalone Staff Management Dashboard** for verified nearby public services across Karnataka. Built with **Pure PHP, HTML5, Vanilla JavaScript, CSS3, and MySQL for XAMPP (Zero Node.js)**.

---

## 🏛️ Project Overview

This dashboard is a dedicated administrative tool for authorized staff to review, catalog, verify, publish, unpublish, and organize nearby service listings displayed to citizens in the **Aguntaka Pahachana Kendra** user mobile app.

### Mandated Scope (Strictly Local Services)
- Covers the **11 official service categories**:
  1. Hospitals
  2. Clinics
  3. Pharmacies
  4. Police Stations
  5. Fire Stations
  6. Bus / Transport
  7. Government Offices
  8. Women & Child Services
  9. Education
  10. Employment
  11. Legal Services
- Customer action data support: **Call**, **Directions**, **Information**, and **Nearby Services Radius Search**.
- Strictly decoupled from unrelated modules (no accommodation, payments, agreements, or customer app modifications).

---

## 🚀 Running on XAMPP (Zero Node.js Required)

### 1. Database Setup
Ensure **Apache** and **MySQL** are running in your XAMPP Control Panel.

The database `aguntaka_local_services` and all starter seed data will **automatically initialize** on first launch. You can also run the database setup runner manually:
- Via Browser: Open `http://localhost/local_services/setup_db.php`
- Via CLI:
  ```powershell
  & "C:\xampp\php\php.exe" "c:\Users\ADMIN\OneDrive\Desktop\Local Services\setup_db.php"
  ```

### 2. Access the Application
The project is available directly through XAMPP Apache:
- **URL:** [http://localhost/local_services/](http://localhost/local_services/)
- Or if using PHP's built-in server:
  ```powershell
  & "C:\xampp\php\php.exe" -S localhost:8000
  ```
  Then navigate to `http://localhost:8000/`.

---

## 🔐 Demo Credentials

| Role | Login Identifier | Default Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Supervisor** | `supervisor` **(Username only; Email disabled)** | `Admin@123` | Full approval, publish, unpublish, archive permissions |
| **Field Staff** | `staff` **(Username only; Email disabled)** | `Staff@123` | Create listings, edit drafts, submit for supervisor review |

*(Clickable prefill buttons are provided directly on the login screen for instant testing).*

---

## 📁 Architecture & File Structure

```
├── .htaccess                     # Apache rules, UTF-8 charset & security guards
├── README.md                     # Documentation & setup instructions
├── index.php                     # Entrypoint router (redirects to dashboard or login)
├── login.php                     # Secure staff login with password visibility toggle & demo credentials
├── logout.php                    # Session termination & safe redirect
├── dashboard.php                 # Summary metrics, category breakdown, & map preview
├── services.php                  # Manage local services table with search, filters & actions
├── service-form.php              # 6-section Add/Edit form with Leaflet map picker & duplicate warning
├── service-view.php              # Staff administrative record & customer mobile preview
├── map.php                       # Interactive OpenStreetMap with category filtering & fallback table
├── reports.php                   # Data completeness audits & one-click CSV report exports
├── setup_db.php                  # One-click database installation & migration verification
│
├── api/
│   ├── check_duplicate.php       # AJAX duplicate service warning detector
│   ├── nearby_services.php       # Customer API: Geospatial Haversine distance search (Published only)
│   ├── public_services.php       # Customer API: Public feed returning customer-safe fields
│   ├── reports.php               # JSON metrics & downloadable CSV generation
│   └── services.php              # Staff REST API (CRUD, status transitions, activity logging)
│
├── assets/
│   ├── css/
│   │   └── style.css             # Vanilla CSS design system (Inter/Outfit typography, responsive layout)
│   └── js/
│       ├── form.js               # Form validation, Leaflet coordinate picker & duplicate check
│       ├── main.js               # Toast alerts, modal controller, & customer app preview modal
│       └── services.js           # Live search, filters, pagination, & status workflow dialogs
│
├── config/
│   ├── auth.php                  # Authentication, session security & role check methods
│   ├── constants.php             # 11 Categories, statuses workflow & Karnataka districts
│   └── database.php              # PDO MySQL connection handler & auto-installer
│
├── database/
│   └── schema.sql                # Complete schema & 18 realistic Karnataka seed records
│
└── includes/
    ├── footer.php                # Modals, toast container & Leaflet CDN scripts
    ├── header.php                # HTML head, typography, styles & navigation tags
    ├── sidebar.php               # Persistent sidebar navigation with live review badge
    └── topbar.php                # Top bar with quick actions & user info
```

---

## 🛡️ Security & Privacy Compliance

- **Role Verification:** Critical actions (Approve, Publish, Unpublish, Archive) are strictly gated on both client and server to the `supervisor` role.
- **Customer Privacy & Shielding:** Customer endpoints (`/api/public_services.php` and `/api/nearby_services.php`) strictly return **only published listings** and strip out internal notes, staff creator IDs, review notes, and audit logs.
- **Data Integrity:** Latitude (-90 to 90) and Longitude (-180 to 180) are strictly validated. "Pick on Map" allows precise visual coordinate selection.
