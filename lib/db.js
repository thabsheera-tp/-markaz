import postgres from 'postgres';

// Connection string configuration
const connectionString =
  process.env.DATABASE_URL ||
  process.env.DIRECT_URL ||
  'postgresql://markaz_user:KoyyamMarkaz2026Secure!@db.qlfaysbmmgspifkovyox.supabase.co:5432/postgres?sslmode=require';

// Re-use connection across hot reloads in Next.js development & serverless lambdas
let sql = global.__markaz_sql;
if (!sql) {
  sql = postgres(connectionString, {
    ssl: 'require',
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false, // Recommended for transaction poolers (PgBouncer / Supabase Pooler)
    types: {
      // Map int8 / BIGINT (e.g. COUNT(*)) to JavaScript Number for seamless SQLite parity
      int8: {
        to: 20,
        from: [20],
        parse: (x) => Number(x),
        serialize: (x) => x.toString(),
      },
    },
  });
  global.__markaz_sql = sql;
}

/**
 * Converts SQLite-style '?' placeholders into PostgreSQL-style '$1, $2, ...'
 */
function convertSql(sqlQuery) {
  let index = 0;
  return sqlQuery.replace(/\?/g, () => `$${++index}`);
}

export const query = {
  /**
   * Executes an INSERT, UPDATE, or DELETE query.
   * Automatically appends 'RETURNING id' to INSERT statements if not present,
   * returning { lastID, changes } for full SQLite compatibility.
   */
  async run(sqlQuery, params = []) {
    let converted = convertSql(sqlQuery.trim());
    const isInsert = /^\s*insert\s+into\s+/i.test(converted);
    const hasReturning = /returning\s+/i.test(converted);

    if (isInsert && !hasReturning) {
      converted += ' RETURNING id';
    }

    const rows = await sql.unsafe(converted, params);
    const lastID = rows && rows.length > 0 && rows[0].id !== undefined ? Number(rows[0].id) : undefined;
    const changes = rows ? rows.count : 0;
    return { lastID, changes };
  },

  /**
   * Returns a single row or null.
   */
  async get(sqlQuery, params = []) {
    const converted = convertSql(sqlQuery);
    const rows = await sql.unsafe(converted, params);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  /**
   * Returns an array of rows.
   */
  async all(sqlQuery, params = []) {
    const converted = convertSql(sqlQuery);
    const rows = await sql.unsafe(converted, params);
    return rows ? Array.from(rows) : [];
  },

  /**
   * Executes multi-statement raw SQL without parameters.
   */
  async exec(sqlQuery) {
    return await sql.unsafe(sqlQuery);
  },
};

/**
 * Initializes tables if not already present.
 */
export async function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'editor', 'viewer')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      last_login TIMESTAMPTZ
    );

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

    CREATE TABLE IF NOT EXISTS about (
      id BIGINT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      stats_json TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS mission_vision (
      id BIGSERIAL PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('mission', 'vision')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

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

    CREATE TABLE IF NOT EXISTS donation_settings (
      id BIGINT PRIMARY KEY,
      preset_amounts TEXT NOT NULL,
      custom_enabled INTEGER DEFAULT 1,
      qr_code_url TEXT NOT NULL,
      upi_id TEXT NOT NULL,
      merchant_name TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

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

    CREATE TABLE IF NOT EXISTS activity_logs (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT,
      user_name TEXT,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

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
  `;
  try {
    await sql.unsafe(schema);
  } catch (err) {
    console.error('Database schema init error:', err);
  }
}

export default sql;
