# Koyyam Markaz - Deployment Guide

This guide explains how to deploy the Full-Stack Next.js Koyyam Markaz application.

---

## Option 1: VPS Deployment (Recommended for SQLite & Local Uploads)
Ideal for Linux VPS (Ubuntu, Debian, Hostinger, DigitalOcean, Hetzner, AWS EC2, Linode).

### Method A: Using Docker & Docker Compose (Fastest & Easiest)
1. **Clone the repository** to your VPS:
   ```bash
   git clone <your-repo-url> markaz
   cd markaz
   ```
2. **Configure environment variables**:
   Create `.env.local` or edit `docker-compose.yml`:
   ```bash
   JWT_SECRET=generate_a_random_32_char_secret_key
   PORT=3000
   ```
3. **Start the application**:
   ```bash
   docker compose up -d --build
   ```
4. **Data Persistence**:
   - The SQLite database is automatically persisted in `./data/markaz.db`.
   - All uploaded photos are stored in `./public/uploads/`.
   - The app runs on port `3000`. You can put Nginx or Caddy in front with free SSL (Certbot / Let's Encrypt).

---

### Method B: Direct Node.js + PM2 (Without Docker)
1. **Install Node.js 20+ and PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
2. **Install dependencies and build**:
   ```bash
   npm install
   npm run build
   ```
3. **Start with PM2**:
   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```

---

## Option 2: Serverless Deployment on Vercel + Supabase
If deploying to Vercel (where the file system is read-only and ephemeral), follow these steps:

1. **Create a free Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a new project.
2. **Run the Database Schema**:
   - In your Supabase dashboard, open the **SQL Editor**.
   - Copy and run the contents of [`supabase-schema.sql`](./supabase-schema.sql).
3. **Media Storage**:
   - Create a public bucket in Supabase Storage named `uploads`.
4. **Deploy on Vercel**:
   - Push your repository to GitHub.
   - Import the project into Vercel.
   - Add the following Environment Variables in Vercel settings:
     ```env
     JWT_SECRET=your_jwt_secret_key
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-anon-key
     ```
