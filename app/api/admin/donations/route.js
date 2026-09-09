import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const payment_method = searchParams.get('payment_method');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    let sql = 'SELECT * FROM donations WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as total FROM donations WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      const s = `%${search.trim()}%`;
      // Use ILIKE for case-insensitive search in PostgreSQL
      sql += ' AND (donor_name ILIKE ? OR upi_transaction_id ILIKE ? OR donor_phone ILIKE ?)';
      countSql += ' AND (donor_name ILIKE ? OR upi_transaction_id ILIKE ? OR donor_phone ILIKE ?)';
      params.push(s, s, s);
      countParams.push(s, s, s);
    }

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      countSql += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }

    if (payment_method && payment_method !== 'all') {
      sql += ' AND payment_method = ?';
      countSql += ' AND payment_method = ?';
      params.push(payment_method);
      countParams.push(payment_method);
    }

    if (startDate) {
      sql += ' AND date >= ?';
      countSql += ' AND date >= ?';
      params.push(startDate);
      countParams.push(startDate);
    }

    if (endDate) {
      sql += ' AND date <= ?';
      countSql += ' AND date <= ?';
      params.push(endDate + ' 23:59:59');
      countParams.push(endDate + ' 23:59:59');
    }

    sql += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const donations = await query.all(sql, params);
    const totalRow = await query.get(countSql, countParams);

    return NextResponse.json({
      donations,
      total: totalRow ? Number(totalRow.total) : 0,
      page,
      limit
    });
  } catch (err) {
    console.error('Fetch donations error:', err);
    return NextResponse.json({ error: 'Failed to fetch donations.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const body = await req.json();
    const { donor_name, donor_phone, amount, payment_method, upi_transaction_id, prayer_request, status, date } = body;
    const dateStr = date || new Date().toISOString().replace('T', ' ').substring(0, 19);

    const result = await query.run(
      `INSERT INTO donations (donor_name, donor_phone, amount, payment_method, upi_transaction_id, prayer_request, status, date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        donor_name || 'Anonymous',
        donor_phone || null,
        parseFloat(amount),
        payment_method || 'Cash',
        upi_transaction_id || null,
        prayer_request || null,
        status || 'Completed',
        dateStr,
        dateStr
      ]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Added Donation Record', `Recorded ₹${amount} for ${donor_name}`, ip);

    return NextResponse.json({ message: 'Donation recorded successfully.', id: result.lastID }, { status: 201 });
  } catch (err) {
    console.error('Create donation error:', err);
    return NextResponse.json({ error: 'Failed to create donation record.' }, { status: 500 });
  }
}
