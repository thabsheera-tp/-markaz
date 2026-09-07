# Koyyam Markaz – Full-Stack Web Application

**MARKAZU DA-WATHIL ISLAMIYYA, KOYYAM (KANNUR, KERALA)**  
*Public Website • Secure Role-Based Admin Portal • Donation & Student Trackers • Dynamic Database Layer*

---

## 1. Project Overview

This is a production-ready, full-stack monorepo built specifically for **Koyyam Markaz (Markazu Da-wathil Islamiyya)**. The application provides:

1. **A Dynamic Public Website**:
   - Built with modern **React**, styled using **Tailwind CSS** with the institution's official palette: **Deep Blue (`#0a2e4a`)**, **Leaf Green (`#2d8b46`)**, **Red (`#c0392b`)**, and **Gold (`#c59b27`)**.
   - Features an auto-cycling hero carousel, interactive about section, mission & vision cards, a responsive 3×3 grid of the 9 educational wings, and an instant UPI donation modal with QR code generation.
   - **Zero hard-coded content**: every piece of text, metric, image, and link is fetched dynamically from the database.
2. **A Secure Role-Based Admin Portal (`/admin` or `#admin`)**:
   - Password-protected with JWT authentication and Role-Based Access Control (**Super Admin**, **Editor**, **Viewer**).
   - Complete CRUD management over all public website sections (Hero Slides, About Us, Mission & Vision, 9 Institutions, Donation Gateway, Footer).
   - Integrated image upload powered by **Multer** and static media serving.
3. **Dedicated Operational Trackers**:
   - **Donation Tracker & Financial Analytics**: Real-time KPI summaries (Total Collected, This Month, Today, Average Donation), 6-month monthly trend curves, payment channel distribution (UPI vs. Bank vs. Cash), searchable records with inline status updater, and **1-click CSV export**.
   - **Institutional & Student Tracker**: Enrolled students table, fee status distribution (Paid, Partial, Scholarship, Due), course popularity breakdown across all 9 departments, and student intake CRUD.
4. **Data Reset & Live Launch ("Danger Zone")**:
   - Allows administrators to purge mock test transactions in 1-click through the UI before public launch, ensuring clean financial ledgers without touching code.

---

## 2. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast modern single-page application |
| **Styling** | Tailwind CSS v3 | Custom HSL-tuned Markaz brand palette & responsive design |
| **Icons & Visuals** | Lucide React + Canvas Confetti | Modern UI icons & celebratory donation feedback |
| **Charts / Analytics** | Recharts | Interactive Area & Pie charts for financial & enrollment trends |
| **Backend API** | Node.js + Express.js (ES Modules) | High-performance RESTful API endpoints |
| **Database** | SQLite3 | Relational database with automatic migration and seeding |
| **Authentication** | JWT + bcryptjs | Secure password hashing with role authorization middleware |
| **File Storage** | Multer | Multipart uploads for hero banners, QR codes, and campus media |

---

## 3. Directory Structure

```
markaz/
├── backend/
│   ├── data/
│   │   └── markaz.db            # SQLite database file
│   ├── uploads/                 # Uploaded banners, campus images, QR codes
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT verification & RBAC middleware
│   │   ├── routes/
│   │   │   ├── auth.js          # Login, profile & user management routes
│   │   │   ├── public.js        # Public content aggregation & donate API
│   │   │   ├── admin.js         # Analytics, donations, students, CRUD routes
│   │   │   └── upload.js        # Multer image upload endpoint
│   │   ├── db.js                # SQLite connection & schema initialization
│   │   ├── seed.js              # Database seeder copying Markaz photos & sample data
│   │   └── server.js            # Express application entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── public/          # Public website components (Navbar, Hero, etc.)
│   │   │   └── admin/           # Admin portal & tracker components
│   │   ├── services/
│   │   │   └── api.js           # Centralized API client service
│   │   ├── App.jsx              # Routing & view-switching orchestrator
│   │   ├── index.css            # Tailwind directives & typography
│   │   └── main.jsx
│   ├── tailwind.config.js       # Brand color extensions
│   ├── Dockerfile
│   └── package.json
│
├── .env.example
├── docker-compose.yml
├── run-dev.js                   # Cross-platform development server runner
├── package.json                 # Monorepo root scripts
└── README.md
```

---

## 4. Default Credentials (Pre-Seeded)

The database comes pre-seeded with 3 administrative tiers:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@koyyammarkaz.org` | `Admin@123` | Full control, User Management, Danger Zone purge |
| **Editor** | `editor@koyyammarkaz.org` | `Editor@123` | Content CRUD, recording donations & enrolling students |
| **Viewer** | `viewer@koyyammarkaz.org` | `Viewer@123` | Read-only analytics & tracker inspection |

> **Note**: In the Admin Login page, convenient **1-Click Demo Buttons** are provided to test all three roles instantly.

---

## 5. Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: Version 18 or higher (tested on Node 20 & 24)
- **npm**: Version 9 or higher

### Step 1: Install Dependencies
From the root workspace directory, run:
```bash
npm run install:all
```
*(Or install inside `backend` and `frontend` folders individually with `npm install`)*

### Step 2: Seed the Database
Seed the SQLite database with 6 hero slides, authentic Markaz campus photos, 9 educational wings, 60+ donations, 35+ enrolled students, and default settings:
```bash
npm run seed
```

### Step 3: Run the Development Server
Start both backend (port 5000) and frontend (port 5173) simultaneously:
```bash
npm run dev
```

- **Public Website**: Open [http://localhost:5173](http://localhost:5173)
- **Admin Portal**: Open [http://localhost:5173/#admin](http://localhost:5173/#admin) or click the **"Admin Portal"** button in the header or footer.
- **Backend API**: Running at [http://localhost:5000/api](http://localhost:5000/api)

---

## 6. How to Remove Mock Data & Go Live

To prepare the application for real live operational deployment:

1. **Login as Super Admin** (`admin@koyyammarkaz.org` / `Admin@123`).
2. Navigate to the **"Danger Zone"** section on the sidebar.
3. Click **"Clear All Donations"**:
   - This purges all test donation records from the database.
   - The financial ledger resets to ₹0.
   - All institutional settings, hero slides, and institutions are safely preserved.
4. Go to **"Donation Settings"** and verify/update the official UPI ID (e.g. `koyyammarkaz@upi`) and upload the institution's official bank QR code.
5. Go to **"Footer Settings"** and confirm the official contact phone numbers and email routing.
6. Create your permanent administrator accounts in **"User Management"** and delete or change the passwords of demo accounts.

---

## 7. Key Features & Acceptance Criteria Verification

- [x] **Public Site Design**: Pixel-perfect responsive layout adhering to Deep Blue, Leaf Green, Red, and Gold palette with smooth scroll navigation and mobile drawer.
- [x] **Zero Hardcoded Data**: All sections (Hero carousel, About Us narrative, Mission & Vision, 9 Institutions, Donation presets, Footer contacts) are populated via `/api/public/content`.
- [x] **Interactive Donation System**: Dynamic amount presets, custom amount input, prayer request (Niyyah), and a QR code modal with UPI deep-linking, copyable VPA, UTR reference capture, and printable digital receipts.
- [x] **Donation Tracker**: Real-time KPI summaries, Recharts monthly trend chart, payment channel distribution pie chart, filterable live data table, inline status changer, and **Export to CSV**.
- [x] **Student & Institutional Tracker**: Enrolled students table, course distribution bar chart, fee status breakdown, and student intake CRUD.
- [x] **Content Management**: Interactive CRUD for Hero Slides, About Us, Mission & Vision, 9 Institutions, Donation Settings, and Footer.
- [x] **User Management**: Super Admin controls for creating new users, assigning roles, and resetting passwords.
- [x] **Activity Logs**: Immutable audit trails recording administrative modifications.
- [x] **Authentic Assets**: Existing Markaz photography (`assembly.jpeg`, `dars.jpeg`, `full.jpeg`, `hifz.jpeg`, `indpndce day.jpeg`, `markaz.jpeg`, `masjid.jpeg`, `mekz.jpeg`) automatically copied and served.
