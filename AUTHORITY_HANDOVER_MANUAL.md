# 🏛️ KOYYAM MARKAZ (MARKAZU DA-WATHIL ISLAMIYYA)
## Official Website & Administration Console Handover Manual

**Document Date:** September 2026  
**Primary Domain:** [https://koyyammarkaz.com](https://koyyammarkaz.com)  
**Administration Portal:** [https://koyyammarkaz.com/admin](https://koyyammarkaz.com/admin)

---

## 1. Executive Summary & Deliverables

The official full-stack web portal for **Koyyam Markaz (MARKAZU DA-WATHIL ISLAMIYYA)** is completed, secured, and deployed live to production. 

### Key Capabilities:
- **Zero-Commission Direct UPI Donations**: Supports instant mobile giving via GPay, PhonePe, Paytm, and BHIM QR with real-time prayer request recording and automated CSV financial auditing.
- **Dynamic Institutional CMS**: Full control over hero sliders, campus documentary tour, news bulletins, and academic departments.
- **Governing Leadership Directory**: Official board profiles with designations, contact details, and term records.
- **Role-Based Security**: Three permission levels ensuring administrative integrity, preventing unauthorized modifications.
- **Enterprise-Grade Infrastructure**: Hosted on high-speed global Edge CDN with automated SSL, DDoS mitigation, and database-backed brute-force rate limiting.

---

## 2. Master Credentials & Initial Access

| Portal Component | URL / Details |
|---|---|
| **Public Website** | `https://koyyammarkaz.com` |
| **Administration Console** | `https://koyyammarkaz.com/admin` |
| **Master Admin Email** | `admin@koyyammarkaz.com` |
| **Initial Password** | `Admin@123` *(Must be changed immediately upon handover)* |

---

## 3. Mandatory First-Day Setup Checklist (Before Public Launch)

The Management Board / Treasurer must complete these 4 actions:

### ✅ Action 1: Configure Official Institution UPI Gateway
1. Log in to **[Admin Console](https://koyyammarkaz.com/admin)**.
2. In the left navigation menu, select **Donation Settings**.
3. Update:
   - **UPI ID**: Set to your official institutional VPA (e.g., `koyyammarkaz@sbi` or `koyyammarkaz@federal`).
   - **Merchant / Account Name**: Enter legal name (e.g., `MARKAZU DA-WATHIL ISLAMIYYA`).
   - **Preset Giving Options**: Set default amounts (e.g., ₹500, ₹1000, ₹2500, ₹5000, ₹10000).
4. Click **Save Settings**.
5. **Conduct a ₹10 test transfer**: Make a test donation on the website and verify the transaction in the Markaz bank account.

### ✅ Action 2: Purge Sample Test Donations
1. In the Admin sidebar, navigate to **Danger Zone**.
2. Click **"Clear All Donations"** and confirm.
3. *Effect*: Wipes all sample test donation logs and resets total donation analytics to ₹0, ensuring future reports contain only genuine public contributions.

### ✅ Action 3: Verify Official Contact & Social Media Links
1. Navigate to **Footer Settings**.
2. Verify and update:
   - Primary and Secondary Office Phone Numbers
   - Official Email (`info@koyyammarkaz.com`, `office@koyyammarkaz.com`)
   - Official WhatsApp helpline link
   - Campus postal address and PIN code
   - Official YouTube, Facebook, and Instagram URLs
3. Click **Save Footer Settings**.

### ✅ Action 4: Change Master Password & Remove Demo Accounts
1. Navigate to **User Management**.
2. Find `admin@koyyammarkaz.com` → Click the **Key (Change Password)** icon → Set your private, strong password.
3. Click the **Trash** icon next to all sample test accounts (`testadmin@...`, `testeditor@...`, `testviewer@...`) to permanently remove them.

---

## 4. User Role Hierarchy & Delegation

The console provides 3 distinct security tiers for Markaz staff:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SUPER ADMIN (President / General Secretary / Treasurer)  │
│    - Complete governance: Financials, Settings, Users, Logs │
└──────────────────────────────┬──────────────────────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         ▼                                           ▼
┌────────────────────────────────┐ ┌────────────────────────────────┐
│ 2. CONTENT EDITOR              │ │ 3. READ-ONLY AUDITOR (VIEWER)  │
│    (Office Staff / Media Team) │ │    (Accountant / External CA)  │
│    - Announcements & Circulars │ │    - View Donation ledger      │
│    - Hero slides & gallery     │ │    - View Student directory    │
│    - Committee profiles        │ │    - Export CSV financial logs │
│    - Student enrollments       │ │    - NO edit / delete rights   │
└────────────────────────────────┘ └────────────────────────────────┘
```

---

## 5. Daily Staff Operating Guide

### A. Publishing Circulars, Events & Press Releases
1. Go to **Announcements** (`/admin#admin/events`).
2. Click **"+ Add New Announcement"**.
3. Fill in:
   - **Title**: Program name or circular subject
   - **Category**: *Event*, *Announcement*, *Notice*, or *Press Release*
   - **Date & Time**: When the program or deadline occurs
   - **Location**: Campus auditorium or venue
   - **Content**: Detailed text in English or Malayalam
   - **Banner Image**: Upload event poster (JPG, PNG, WebP)
4. Toggle **"Featured"** if you want it pinned to the top of the homepage bulletin.
5. Click **Save Announcement**.

### B. Exporting Financial Reports for Auditing
1. Go to **Donation Tracker** (`/admin#admin/donations`).
2. Filter transactions by date or payment status (*Completed* / *Pending*).
3. Click **"Export CSV"** in the top right.
4. The downloaded spreadsheet includes Donor Name, Phone Number, Transaction ID, Amount, Date, and Prayer Request (Dua), ready for Microsoft Excel or accounting software.

### C. Updating Committee Leadership
1. Go to **Committee Manager** (`/admin#admin/committee`).
2. To update existing officers, click **Edit**.
3. To add a new governing board member, click **"+ Add Member"** → Input name, title, role category (President, Secretary, Treasurer, Member), photo, and term period.
4. Click **Save Member**.

---

## 6. Technical Architecture & Ownership Transfer

The authority maintains 100% legal and technical ownership of all assets:

| Component | Provider | Ownership / Management Note |
|---|---|---|
| **Domain Registrar** | GoDaddy / Namecheap | `koyyammarkaz.com` DNS points to Vercel (`76.76.21.21`). |
| **Web Hosting** | Vercel (Edge CDN) | Automated SSL (Let's Encrypt), auto-renewing every 90 days at zero cost. |
| **Database** | Supabase (PostgreSQL) | Cloud-hosted relational database with automated daily backups. |
| **Storage CDN** | Supabase Cloud Storage | High-speed global delivery for uploaded campus photos and event posters. |
| **Source Code** | GitHub Repository | Fully version-controlled codebase. |

---

## 7. Security Best Practices for the Office

1. **Never share Super Admin credentials over WhatsApp or SMS.**
2. Create dedicated **Content Editor** accounts for individual office clerks using their personal work email.
3. Always log out when using shared office computers by clicking **"Sign Out"** in the top right of the Admin Console.
4. In case of an emergency, passwords can be reset directly from the database or by any remaining Super Admin account.

---
*Manual Prepared for the Governing Board of Koyyam Markaz.*
