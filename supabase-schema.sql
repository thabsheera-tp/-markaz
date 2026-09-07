-- ==========================================================
-- Koyyam Markaz Database Schema for Supabase (PostgreSQL)
-- ==========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- 2. Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  order_num INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. About Section Table
CREATE TABLE IF NOT EXISTS about (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  stats_json TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Mission & Vision Table
CREATE TABLE IF NOT EXISTS mission_vision (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('mission', 'vision')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT NOT NULL,
  order_num INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  enrollment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id BIGSERIAL PRIMARY KEY,
  donor_name TEXT,
  donor_phone TEXT,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  upi_transaction_id TEXT,
  prayer_request TEXT,
  status TEXT NOT NULL CHECK(status IN ('Completed', 'Pending', 'Failed')),
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Students Table
CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  institution_id BIGINT REFERENCES institutions(id) ON DELETE SET NULL,
  enrollment_date TEXT,
  fee_status TEXT NOT NULL CHECK(fee_status IN ('Paid', 'Partial', 'Scholarship', 'Due')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Donation Settings Table
CREATE TABLE IF NOT EXISTS donation_settings (
  id BIGINT PRIMARY KEY,
  preset_amounts TEXT NOT NULL,
  custom_enabled INTEGER DEFAULT 1,
  qr_code_url TEXT NOT NULL,
  upi_id TEXT NOT NULL,
  merchant_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Footer Settings Table
CREATE TABLE IF NOT EXISTS footer_settings (
  id BIGINT PRIMARY KEY,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  facebook TEXT,
  instagram TEXT,
  youtube TEXT,
  whatsapp TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  user_name TEXT,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Temporary Committee Table
CREATE TABLE IF NOT EXISTS temporary_committee (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  role_type TEXT DEFAULT 'other',
  photo_url TEXT,
  phone TEXT,
  email TEXT,
  term_period TEXT,
  bio TEXT,
  order_num INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('Event', 'Announcement', 'Notice', 'Press Release')),
  event_date TEXT,
  event_time TEXT,
  location TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  is_featured INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
