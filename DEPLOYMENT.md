# Koyyam Markaz - Deployment Guide

This guide explains how to deploy the Full-Stack Next.js Koyyam Markaz application.

---

## 🚀 Option 1: Vercel + Supabase (Recommended & 100% Free Tier)

This architecture uses **Vercel** for hosting the Next.js frontend/serverless API and **Supabase** for the PostgreSQL database & media storage CDN.

### Step 1: Push Changes to GitHub
Commit and push all changes to your GitHub repository:
```bash
git add .
git commit -m "Migrate database to Supabase PostgreSQL and Storage"
git push origin main
```

### Step 2: Import Project to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`koyyam-markaz` / `-markaz`).
4. Keep the Framework Preset as **Next.js**.

### Step 3: Configure Environment Variables in Vercel
In the Vercel project configuration page (under **Environment Variables**), add the following:

| Key | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://<username>:<password>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require` | Connection pooler for Serverless |
| `DIRECT_URL` | `postgresql://<username>:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require` | Direct connection fallback |
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` | Supabase project URL |
| `SUPABASE_ANON_KEY` | `<your-supabase-anon-key>` | Supabase public anon key |
| `JWT_SECRET` | `<generate-a-strong-random-32-char-secret>` | Secure session secret key |
| `NODE_ENV` | `production` | Production environment |

### Step 4: Click Deploy
Click **Deploy**. The build will finish cleanly with zero GLIBC errors!

---

## 🐳 Option 2: Linux VPS (Docker & Docker Compose)

If you prefer hosting on your own Linux VPS (Hostinger, DigitalOcean, Hetzner, AWS EC2):

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url> markaz
   cd markaz
   ```
2. **Start the application**:
   ```bash
   docker compose up -d --build
   ```
3. **Data & Uploads**:
   - The application runs on port `3000`.
   - Reverse proxy with Nginx or Caddy with free SSL (Let's Encrypt).

---

## 🔐 Default Admin & Editor Login Credentials

Access the **Admin Portal** at `/admin` (or click **Admin Portal** in the website header):

| Role | Email | Initial Setup | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@koyyammarkaz.org` | Configured on initial setup/seed | Full access (leadership, donations, settings, user management) |
| **Content Editor** | `editor@koyyammarkaz.org` | Configured on initial setup/seed | Edit slides, announcements, institutions, about text, etc. |
| **Read-Only Auditor**| `viewer@koyyammarkaz.org` | Configured on initial setup/seed | View donation logs, financial reports, students (cannot edit) |

> 💡 *Always change any default passwords immediately via **Admin Portal → User Management** or set strong custom passwords in your initial seed before deployment.*
