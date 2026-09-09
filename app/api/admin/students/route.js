import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const institution_id = searchParams.get('institution_id');
    const fee_status = searchParams.get('fee_status');

    let sql = `
      SELECT s.*, i.name as institution_name
      FROM students s
      LEFT JOIN institutions i ON s.institution_id = i.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      const s = `%${search.trim()}%`;
      // Use ILIKE for case-insensitive search in PostgreSQL
      sql += ' AND (s.name ILIKE ? OR s.email ILIKE ? OR s.phone ILIKE ?)';
      params.push(s, s, s);
    }
    if (institution_id && institution_id !== 'all') {
      sql += ' AND s.institution_id = ?';
      params.push(institution_id);
    }
    if (fee_status && fee_status !== 'all') {
      sql += ' AND s.fee_status = ?';
      params.push(fee_status);
    }

    sql += ' ORDER BY s.id DESC';
    const students = await query.all(sql, params);
    return NextResponse.json({ students });
  } catch (err) {
    console.error('Fetch students error:', err);
    return NextResponse.json({ error: 'Failed to fetch students.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const body = await req.json();
    const { name, email, phone, institution_id, enrollment_date, fee_status } = body;
    if (!name) {
      return NextResponse.json({ error: 'Student name is required.' }, { status: 400 });
    }

    const dateStr = enrollment_date || new Date().toISOString().split('T')[0];
    const result = await query.run(
      `INSERT INTO students (name, email, phone, institution_id, enrollment_date, fee_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), email?.trim() || null, phone?.trim() || null, institution_id || null, dateStr, fee_status || 'Paid']
    );

    if (institution_id) {
      await query.run('UPDATE institutions SET enrollment_count = enrollment_count + 1 WHERE id = ?', [institution_id]);
    }

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Enrolled Student', `Enrolled ${name} (ID: ${result.lastID})`, ip);

    return NextResponse.json({ message: 'Student registered successfully.', id: result.lastID }, { status: 201 });
  } catch (err) {
    console.error('Add student error:', err);
    return NextResponse.json({ error: 'Failed to add student.' }, { status: 500 });
  }
}
